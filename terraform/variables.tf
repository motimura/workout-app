# variables.tf
variable "environment" {
  description = "環境名（dev, staging, prod）"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "プロジェクト名"
  type        = string
  default     = "workout-app"
}

variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "dynamodb_table_name" {
  description = "DynamoDBテーブル名"
  type        = string
  default     = "workouts-terraform-test"
}

variable "s3_bucket_prefix" {
  description = "S3バケット名のプレフィックス"
  type        = string
  default     = "workout-app-frontend"
}

variable "unique_suffix" {
  description = "バケット名を一意にするためのサフィックス"
  type        = string
  default     = "saitoh"
}
