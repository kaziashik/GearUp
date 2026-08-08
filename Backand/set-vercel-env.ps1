# Vercel Environment Variables Setup Script
# Run this after deploying your backend to Vercel

Write-Host "🚀 Setting up Vercel Environment Variables..." -ForegroundColor Green
Write-Host ""

# Set environment variables
# ⚠️ IMPORTANT: Replace these placeholder values with your actual credentials
$envVars = @{
    "NODE_ENV" = "production"
    "DATABASE_URL" = "your-postgres-connection-string-here"
    "JWT_ACCESS_SECRET" = "your-jwt-access-secret-here"
    "JWT_REFRESH_SECRET" = "your-jwt-refresh-secret-here"
    "JWT_ACCESS_EXPIRES_IN" = "15m"
    "JWT_REFRESH_EXPIRES_IN" = "7d"
    "STRIPE_SECRET_KEY" = "your_stripe_secret_key_here"
    "STRIPE_WEBHOOK_SECRET" = "your_stripe_webhook_secret_here"
    "GOOGLE_CLIENT_ID" = "your-google-client-id.apps.googleusercontent.com"
}

Write-Host "⚠️  IMPORTANT: Update these URLs after you get your Vercel deployment URLs:" -ForegroundColor Yellow
Write-Host "   - STRIPE_SUCCESS_URL" -ForegroundColor Yellow
Write-Host "   - STRIPE_CANCEL_URL" -ForegroundColor Yellow
Write-Host "   - CLIENT_URL" -ForegroundColor Yellow
Write-Host ""

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Setting $key..." -ForegroundColor Cyan
    
    # Create a temporary file with the value
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $value -NoNewline
    
    # Use the file as input to vercel env add
    Get-Content $tempFile | vercel env add $key production
    
    # Clean up temp file
    Remove-Item $tempFile
}

Write-Host ""
Write-Host "✅ Environment variables set!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Get your backend URL from Vercel dashboard" -ForegroundColor White
Write-Host "2. Deploy your frontend" -ForegroundColor White
Write-Host "3. Update STRIPE_SUCCESS_URL, STRIPE_CANCEL_URL, and CLIENT_URL with your frontend URL" -ForegroundColor White
Write-Host "4. Run: vercel --prod" -ForegroundColor White
Write-Host ""
