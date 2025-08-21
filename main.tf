resource "random_pet" "name" {
    length = 2

    keepers = {
        run_id = timestamp() 
    }
}

# this helps hold the current date/time
locals {
    today_date = formatdate("DD-MM-YYYY", timestamp())
    now_time = formatdate("hh:mm:ss", timestamp())
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

# generate a dynamic index.html
resource "local_file" "index" {
      content = templatefile("${path.module}/my_fun_site/index.html.tmpl", {
        today_date = local.today_date
        now_time = local.now_time
      })

      filename = "${path.module}/my_fun_site/index.html"
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

    depends_on = [ local_file.index ]
}