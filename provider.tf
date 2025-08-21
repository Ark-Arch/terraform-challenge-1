provider "netlify" {
    token = var.netlify_token 
}

provider "github" {
    token = var.github_token
    owner = var.github_owner
}

provider "random" {
}

provider "local" {
}