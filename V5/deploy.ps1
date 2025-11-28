# Build the project
Write-Host "Building project..." -ForegroundColor Cyan
Set-Location "d:\AI Projects\SatyFit Lite\V5"
npm run build

# Navigate to dist folder
Write-Host "Deploying to GitHub Pages..." -ForegroundColor Cyan
Set-Location dist

# Initialize git and push
git init
git add -A
git commit -m "Deploy"
git push -f https://github.com/aymandwidar/stayfitlite-v3.git main:gh-pages

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Your app will be available at: https://aymandwidar.github.io/stayfitlite-v3/" -ForegroundColor Yellow
