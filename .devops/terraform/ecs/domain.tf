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
