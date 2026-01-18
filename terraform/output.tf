output "dynamodb_table_name" {
  description = "DynamoDBテーブル名"
  value       = aws_dynamodb_table.workouts_prod.name
}

output "dynamodb_table_arn" {
  description = "DynamoDBテーブルのARN"
  value       = aws_dynamodb_table.workouts_prod.arn
  sensitive   = true
}

output "s3_bucket_name" {
  description = "S3バケット名"
  value       = aws_s3_bucket.frontend_prod.bucket
}

output "s3_bucket_arn" {
  description = "S3バケットのARN"
  value       = aws_s3_bucket.frontend_prod.arn
  sensitive   = true
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.workout_pool.id
  sensitive   = true
}

output "cognito_user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = aws_cognito_user_pool.workout_pool.arn
  sensitive   = true
}

output "cognito_client_id" {
  description = "Cognito Client ID"
  value       = aws_cognito_user_pool_client.workout_client.id
  sensitive   = true
}
