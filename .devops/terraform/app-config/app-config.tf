data "sops_file" "config-dotenv" {
  source_file = "${path.module}/config/${var.deploy_env}.enc.env"
}

resource "local_sensitive_file" "dotenv_config" {
  filename        = ".env"
  file_permission = "444"
  content         = data.sops_file.config-dotenv.raw
}

