$rootPath = "."

$directoriesToDelete = @("bin", "obj", ".vs")

$fileExtensionsToDelete = @(".user")

foreach ($dir in $directoriesToDelete) {
    Get-ChildItem -Path $rootPath -Recurse -Directory -Force -Name $dir |
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

foreach ($ext in $fileExtensionsToDelete) {
    Get-ChildItem -Path $rootPath -Recurse -Filter "*$ext" -Force |
    Remove-Item -Force -ErrorAction SilentlyContinue
}

Write-Host "Cleanup completed."
