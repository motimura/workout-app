terraform {
  # backend設定を追加
  backend "s3" {
    bucket  = "workout-app-terraform-state-saitoh"
    key     = "terraform.tfstate"
    region  = "ap-northeast-1"
    encrypt = true
  }

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

# DynamoDBテーブル
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

# S3バケット（フロントエンド）
resource "aws_s3_bucket" "frontend_prod" {
  bucket = "workout-app-frontend-saitoh"

  tags = {
    Environment = "production"
    Project     = var.project_name
    ManagedBy   = "Terraform"
    Purpose     = "Frontend hosting"
  }
}

# S3バケットのウェブサイト設定
resource "aws_s3_bucket_website_configuration" "frontend_prod" {
  bucket = aws_s3_bucket.frontend_prod.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# S3バケットのパブリックアクセスブロック
resource "aws_s3_bucket_public_access_block" "frontend_prod" {
  bucket = aws_s3_bucket.frontend_prod.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

# S3バケットポリシー
resource "aws_s3_bucket_policy" "frontend_prod" {
  bucket = aws_s3_bucket.frontend_prod.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend_prod.arn}/*"
      }
    ]
  })
}

# Cognito User Pool
resource "aws_cognito_user_pool" "workout_pool" {
  name = "workout-user-pool"

  # パスワードポリシー
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = false
  }

  # 自動検証
  auto_verified_attributes = ["email"]

  # ユーザー名の設定
  username_attributes = ["email"]

  # アカウント復旧（verified_phone_numberも追加）
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }

  tags = {
    Environment = "production"
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "workout_client" {
  name         = "workout-app-client"
  user_pool_id = aws_cognito_user_pool.workout_pool.id

  # 認証フロー（ALLOW_USER_SRP_AUTHを追加）
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  # トークンの有効期限（0のまま = デフォルト値を使用）
  refresh_token_validity = 30
}

# Terraform State保存用S3バケット
resource "aws_s3_bucket" "terraform_state" {
  bucket = "workout-app-terraform-state-saitoh"

  tags = {
    Name        = "Terraform State"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

# バージョニング
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

# 暗号化
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# パブリックアクセスブロック
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}
