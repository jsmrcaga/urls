module api {
  source = "git@github.com:jsmrcaga/terraform-modules//cloudflare-worker?ref=v0.1.6"

  cloudflare = {
    api_token = var.cloudflare.api_token
    default_zone_id = var.cloudflare.zone_id
    default_account_id = var.cloudflare.account_id
  }

  script = {
    name = "urls"
    content = file("../index.js")

    secrets = {
      AUTH_TOKEN = var.worker_auth_token
      PING_USERNAME = var.ping_username
      PING_PASSWORD = var.ping_password
      PING_ENDPOINT = var.ping_endpoint
    }

    service_bindings = [{
      name = "performance_logger"
      service = "ping_api"
      environment = "production"
    }]
  }

  kv_namespaces = [{
    title = "URL Shortener Database"
    binding = "DATABASE"
  }]

  routes = [{
    pattern = "l.jocolina.com/*"
  }]

  dns_records = [{
    name = "l"
    type = "CNAME"
    value = "jocolina.com"
  }]
}
