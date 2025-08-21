terraform {
    cloud {
      organization = "terraform_6_weeks_challenge"

      workspaces {
        name = "my_fun_site"
      }
    }
}