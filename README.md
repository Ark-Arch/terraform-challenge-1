# 🚀 Deploying a Netlify Site with Terraform + HCP Terraform

This project is part of the **6-week Terraform Challenge with HUG Ibadan**.  
It demonstrates how to deploy a static website on **Netlify** while managing the Terraform state securely in **HCP Terraform (Terraform Cloud)**.  

The goal is to create a **reproducible, team-ready Infrastructure as Code workflow** that others can easily clone, customize, and redeploy.  

---

## 📌 Objectives
- Deploy a static frontend site on Netlify using Terraform.  
- Store Terraform state remotely in HCP Terraform.  
- Keep the setup **dynamic and re-runnable** (no hardcoding values).  
- Securely manage secrets using workspace variables.  
- Document the setup for easy replication.  

---

## 🛠 Prerequisites
Before you start, make sure you have:

1. **Terraform** (v1.5+ recommended) → [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)  
2. A **Netlify account** → [Netlify Signup](https://app.netlify.com/)  
3. A **Netlify Personal Access Token** (to authenticate Terraform).  
4. A free **HCP Terraform (Terraform Cloud)** account → [Sign up here](https://app.terraform.io/signup).  
5. Git installed locally.

## 🔑 Required Variables

Before running the Terraform script, make sure the following variables are defined and ready:

- **`netlify_token`** – Netlify Personal Access Token (used to authenticate with Netlify).  
- **`site_name`** – Base name for your Netlify site (Terraform will generate a unique subdomain).  
- **`github_token`** – GitHub Personal Access Token (needed to add deploy keys to your repository).  
- **`github_owner`** – Your GitHub username or organization name.  
- **`repo_name`** – The repository containing your site code.  
- **`repo_branch`** – The branch to deploy from (default: `main`).  
- **`build_command`** – The command used to build your project (if applicable).  
- **`publish_dir`** – The directory containing the final site output to deploy.  

⚠️ **Tip:**  
Keep tokens **sensitive** (use environment variables or Terraform Cloud workspace variables) and ensure your GitHub repository exists with the correct access permissions before deploying.

---

## ⚙️ Project Structure

```bash
.
├── main.tf          # Core Terraform configuration
├── variables.tf     # Input variables (site name, etc.)
├── outputs.tf       # Outputs (e.g., live site URL)
├── providers.tf     # Providers (Netlify, random, HCP backend)
├── .gitignore       # Ignore local state & secrets
├── site/            # Static site content (HTML, CSS, etc.)
└── README.md        # Project documentation
```



✅ Key Takeaways

Infrastructure as Code (IaC) works beyond AWS/GCP.

Remote state in HCP Terraform makes the workflow team-ready.

Keeping secrets out of the repo is non-negotiable.

The setup is fully reproducible—anyone can clone and deploy
