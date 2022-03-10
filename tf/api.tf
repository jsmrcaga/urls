resource cloudflare_worker_script "url_shortener" {
  name = "urls"
  content = file("../index.js")

  kv_namespace_binding {
    name = "DATABASE"
    namespace_id = cloudflare_workers_kv_namespace.url_database.id
  }

  secret_text_binding {
    name = "AUTH_TOKEN"
    text = var.worker_auth_token
  }
}

resource cloudflare_workers_kv_namespace "url_database" {
  title = "URL Shortener Database"
}

resource cloudflare_worker_route "url_shortener_routes" {
  zone_id = var.cloudflare.zone_id
  pattern = "l.jocolina.com/*"
  script_name = cloudflare_worker_script.url_shortener.name
}


# DNS record
resource cloudflare_record "l_jocolina" {
  zone_id = var.cloudflare.zone_id

  name = "l"
  type = "CNAME"
  value = "@"

  proxied = true
}
