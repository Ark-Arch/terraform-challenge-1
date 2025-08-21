terraform {
  required_providers {
    netlify = {
        source = "AegirHealth/netlify"
        version = "~> 0.6"
    }

    local = {
      source = "hashicorp/local"
      version = "~> 2.0"
    }

    github = {
        source = "integrations/github"
        version = "~> 6.0"
    }

    random = {
        source = "hashicorp/random"
        version = "~> 3.0"
    }

    null = {
      source = "hashicorp/null"
      version = "~> 3.0"
    }

  }
}

