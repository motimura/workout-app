terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_dynamodb_table" "workouts_prod" {
  name         = "Workouts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "workoutId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "workoutId"
    type = "S"
  }

  tags = {
    Environment = "production"
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}
