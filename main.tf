resource "random_pet" "name" {
    length = 2

    keepers = {
        run_id = timestamp() 
    }
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
}