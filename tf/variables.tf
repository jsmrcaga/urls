variable cloudflare {
  type = object({
    email = string,
    api_key = string,
    account_id = string,
    zone_id = string
  })
}

variable github {
  type = object({
    token = string,
    secrets = map(string)
  })
}

variable worker_auth_token {
  type = string
}

variable logsnag_token {
  type = string
}
