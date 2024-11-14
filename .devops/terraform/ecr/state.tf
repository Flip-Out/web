terraform {
  backend "s3" {
    bucket = "flipout-terraform-state"
    key    = "flip-out-web-dev/terraform.tfstate"
    region = "eu-west-1"
  }
}
