terraform {
  required_providers {
    github = {
      source = "integrations/github"
      version = "~> 4.0"
    }

    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "github" {
  token = var.github.token
}

provider "cloudflare" {
  api_token = var.cloudflare.api_token
}
