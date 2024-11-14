variable "deploy_env" {
  type = string
  default = "dev"
}

variable "project_name" {
  type = string
  default = "flip-out"
}

variable "application_name" {
  type = string
  default = "store"
}

variable "application_port" {
  type = number
  default = 8080
}

variable "alb_rule_priority" {
  type = number
  default = 300
}

variable "image_tag" {
  type = string
}
