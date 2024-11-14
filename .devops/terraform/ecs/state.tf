terraform {
  backend "s3" {
    bucket = "flipout-terraform-state"
    key    = "flip-out-web-ecs-dev/terraform.tfstate"
    region = "eu-west-1"
  }
}
