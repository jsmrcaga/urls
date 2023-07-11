variable cloudflare {
  type = object({
    api_token = string,
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

variable ping_username {
  type = string
}

variable ping_password {
  type = string
}

variable ping_endpoint {
  type = string
}
