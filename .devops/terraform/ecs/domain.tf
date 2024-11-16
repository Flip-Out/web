locals {
  cdn-domain = var.deploy_env == "prod" ? var.application_name : "${var.application_name}-${var.deploy_env}"
}

data "cloudflare_zone" "base_zone" {
  name  = "flipout.gg"
}

resource "cloudflare_record" "app_domain" {
  zone_id = data.cloudflare_zone.base_zone.id
  name    = "${var.application_name}.${var.deploy_env}"
  value   = data.aws_alb.alb.dns_name
  type    = "CNAME"
  ttl     = 60
}

resource "cloudflare_record" "cdn_domain" {
  zone_id = data.cloudflare_zone.base_zone.id
  name = local.cdn-domain
  value = cloudflare_record.app_domain.hostname
  type = "CNAME"
  proxied = true
}
