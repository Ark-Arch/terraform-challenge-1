resource "random_pet" "name" {
    length = 2

    keepers = {
        run_id = timestamp() 
    }
}

# this helps hold the current date/time and repo_url
locals {
  today_date = formatdate("02-01-2006", timestamp())
  now_time   = formatdate("15:04:05", timestamp())
  repo_url   = "https://github.com/${var.github_owner}/${var.repo_name}.git"
}


# create the deploy key needed from netlify
resource "netlify_deploy_key" "key" {
}

# add that deploy key to the github
resource "github_repository_deploy_key" "netlify"{
    title = "netlify deploy key"
    repository = var.repo_name
    key = "${netlify_deploy_key.key.public_key}"
    read_only = true
}

resource "null_resource" "update_html" {

    provisioner "local-exec" {
        command = "bash ./helper_scripts/update_html.sh ${local.repo_url}"
        environment = {
          GITHUB_TOKEN = var.github_token
        }
    }

    triggers = {
        always_run = timestamp()
    }  
}


resource "netlify_site" "main" {
    name = "${var.site_name}-${random_pet.name.id}"

    repo {
        repo_branch = var.repo_branch
        command = var.build_command
        deploy_key_id = "${netlify_deploy_key.key.id}"
        dir = var.publish_dir
        provider = "github"
        repo_path = "${var.github_owner}/${var.repo_name}"
    } 

    depends_on = [ null_resource.update_html ]
}