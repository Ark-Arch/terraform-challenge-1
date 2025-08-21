output "site_url" {
    description = "the live site url"
    value = "https://${var.site_name}-${random_pet.name.id}.netlify.app"  
}