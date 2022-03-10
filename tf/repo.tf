resource github_repository "repo" {
  name = "urls"
  description = "A url-shortener & tracking system built on top of CloudFlare Workers & KV storage"

  visibility = "public"

  vulnerability_alerts = false
}

resource github_actions_secret "actions_secrets" {
  for_each = var.github.secrets

  repository = github_repository.repo.name

  secret_name = each.key
  plaintext_value = each.value
}
