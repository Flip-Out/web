terraform {
  backend "s3" {
    bucket = "flipout-terraform-state"
    key    = "flip-out-app-ecs-dev/terraform.tfstate"
    region = "eu-west-1"
  }
}
