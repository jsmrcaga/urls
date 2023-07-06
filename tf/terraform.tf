terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 4.0"
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
}

provider "github" {
  token = var.github.token
}
