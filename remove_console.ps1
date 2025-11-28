# Script to remove all console statements from source files
$files = @(
    "d:\AI Projects\SatyFit Lite\V5\src\utils\testSetup.js",
    "d:\AI Projects\SatyFit Lite\V5\src\utils\AI\GroqClient.js",
    "d:\AI Projects\SatyFit Lite\V5\src\utils\AI\GeminiClient.js",
    "d:\AI Projects\SatyFit Lite\V5\src\utils\AI\DeepSeekClient.js",
    "d:\AI Projects\SatyFit Lite\V5\src\services\HealthKitIntegration.js",
    "d:\AI Projects\SatyFit Lite\V5\src\services\DayInsightGenerator.js",
    "d:\AI Projects\SatyFit Lite\V5\src\services\AIOrchestrator.js",
    "d:\AI Projects\SatyFit Lite\V5\src\components\VoiceInput.jsx",
    "d:\AI Projects\SatyFit Lite\V5\src\components\ExerciseSearchModal.jsx",
    "d:\AI Projects\SatyFit Lite\V5\src\components\cards\SleepCheckCard.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Cleaning $file"
        Get-Content $file | Where-Object { $_ -notmatch "console\.(log|error|warn)" } | Set-Content "$file.tmp" -Force
        Move-Item "$file.tmp" $file -Force
    }
}

Write-Host "All console statements removed!"
