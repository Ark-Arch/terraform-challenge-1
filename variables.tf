variable "netlify_token" {
    type = string
    description = "the netlify PAT"
    sensitive = true
}

# variable "netlify_base_url" {
#     type = string
#     default = "value"  
# }

variable "site_name" {
    type = string
    default = "fun-site"  
    description = "Base name for the Netlify site"
}

variable "github_token" {
    type = string
    description = "github token"
    sensitive = true  
}

variable "github_owner" {
    type = string
    default = "Ark-Arch"
    description = "name of the github owner" 
}

variable "repo_name" {
    type = string
    default = "terraform-challenge-1"
    description = "name of the repository"  
}

variable "repo_branch" {
    type = string
    default = "main"
    description = "the main to be deployed from"  
}

variable "build_command" {
    type = string
    default = ""
    description = "command used to build the code"  
}

variable "publish_dir" {
    type = string
    default = "my_fun_site"
    description = "directory it builds from"
}

