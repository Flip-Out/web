terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.49.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.82.0"
    }
  }
}

provider "aws" {}
provider "cloudflare" {}