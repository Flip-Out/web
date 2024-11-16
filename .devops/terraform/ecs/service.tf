data "aws_vpc" "vpc" {
  tags = merge(
    { project = var.project_name },
    var.deploy_env == "prod" ? { EnvironmentProd = "true" } : { EnvironmentDev = "true" })
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.vpc.id]
  }
  tags = {
    Tier = "private"
  }
}

data "aws_ecs_cluster" "ecs_cluster" {
  cluster_name = local.cluster_name
}

data "aws_alb" "alb" {
  tags = {
    project = var.project_name
  }
}

data "aws_lb_listener" "https" {
  load_balancer_arn = data.aws_alb.alb.arn
  port              = 443
}

data "aws_security_group" "alb_sg" {
  tags = {
    project               = var.project_name
    terraform-aws-modules = "alb"
  }
}

locals {
  cluster_name      = "ecs-cluster-external-${var.deploy_env}"
  name              = "${var.application_name}-${var.deploy_env}"
  use_spots         = var.deploy_env != "prod"
  capacity_provider = local.use_spots ? "spot_${local.cluster_name}" : "on_demand_${local.cluster_name}"
  cpu               = 128
  memory            = 150
}

resource "aws_lb_target_group" "service_tg" {
  name        = "tg-ex-${var.project_name}-${var.application_name}-${var.deploy_env}"
  port        = 80
  protocol    = "HTTP"
  target_type = "instance"
  vpc_id      = data.aws_vpc.vpc.id
}

resource "aws_lb_listener_rule" "app_rule" {
  listener_arn = data.aws_lb_listener.https.arn
  priority     = var.deploy_env == "prod" ? var.alb_rule_priority : var.alb_rule_priority + 1000

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service_tg.arn
  }

  condition {
    host_header {
      values = [cloudflare_record.app_domain.hostname]
    }
  }
}

################################################################################
# Service
################################################################################

module "ecs_service" {
  source = "terraform-aws-modules/ecs/aws//modules/service"

  name        = local.name
  cluster_arn = data.aws_ecs_cluster.ecs_cluster.arn

  requires_compatibilities   = ["EC2"]
  capacity_provider_strategy = {
    provider = {
      capacity_provider = local.capacity_provider
      weight            = 1
      base              = 1
    }
  }
  cpu    = local.cpu
  memory = local.memory
  network_mode   = "bridge"

  # Container definition(s)
  container_definitions = {
    "${var.application_name}-${var.deploy_env}" = {
      cpu           = local.cpu
      memory        = local.memory
      essential     = true
      image         = var.image_tag
      port_mappings = [
        {
          name          = local.name
          containerPort = var.application_port
          hostPort      = 0
          protocol      = "tcp"
        }
      ]

      # Example image used requires access to write to root filesystem
      readonly_root_filesystem = false

      enable_cloudwatch_logging              = true
      create_cloudwatch_log_group            = true
      cloudwatch_log_group_name              = "/aws/ecs/${local.cluster_name}/${var.application_name}-${var.deploy_env}"
      cloudwatch_log_group_retention_in_days = 7

      log_configuration = {
        logDriver = "awslogs"
      }
      memory_reservation = local.memory
    }
  }

  load_balancer = {
    service = {
      target_group_arn = aws_lb_target_group.service_tg.arn
      container_name   = local.name
      container_port   = var.application_port
    }
  }

  subnet_ids           = data.aws_subnets.private.ids
  security_group_rules = {
    alb_ingress_3000 = {
      type                     = "ingress"
      from_port                = 0
      to_port                  = 65535
      protocol                 = "tcp"
      description              = "Service port"
      source_security_group_id = data.aws_security_group.alb_sg.id
    }
    egress_all = {
      type        = "egress"
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  tags = {
    Environment = var.deploy_env
    Terraform   = "true"
  }
}
