terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 3.9.1"
    }

    github = {
      source = "integrations/github"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  email = var.cloudflare.email
  api_key = var.cloudflare.api_key
  account_id = var.cloudflare.account_id
}

provider "github" {
  token = var.github.token
}
