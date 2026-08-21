$ffmpeg = "C:\Users\Segma\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0-full_build\bin\ffmpeg.exe"
$inputDir = $PSScriptRoot
$files = Get-ChildItem -Path $inputDir -Filter "*.MOV"

if ($files.Count -eq 0) {
    Write-Host "No .MOV files found." -ForegroundColor Yellow
    exit
}

if (-not (Test-Path $ffmpeg)) {
    Write-Host "ERROR: ffmpeg not found at $ffmpeg" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($files.Count) .MOV files. Converting..." -ForegroundColor Green

$success = 0
$failed  = 0

foreach ($file in $files) {
    $output = Join-Path $inputDir ($file.BaseName + ".mp4")

    if (Test-Path $output) {
        Write-Host "  [SKIP] $($file.Name) - already converted" -ForegroundColor DarkGray
        $success++
        continue
    }

    Write-Host "  [CONVERTING] $($file.Name) ..." -ForegroundColor Cyan

    $ffmpegArgs = "-i `"$($file.FullName)`" -vcodec h264 -movflags faststart -crf 26 -preset fast -vf scale=720:-2 -an -y `"$output`""

    $process = Start-Process -FilePath $ffmpeg -ArgumentList $ffmpegArgs -Wait -PassThru -NoNewWindow

    if ($process.ExitCode -eq 0) {
        $origMB = [math]::Round($file.Length / 1MB, 1)
        $outMB  = [math]::Round((Get-Item $output).Length / 1MB, 1)
        Write-Host "  [DONE] $($file.BaseName).mp4  ($origMB MB -> $outMB MB)" -ForegroundColor Green
        $success++
    } else {
        Write-Host "  [FAILED] $($file.Name) - exit code $($process.ExitCode)" -ForegroundColor Red
        $failed++
    }
}

$color = if ($failed -eq 0) { "Green" } else { "Yellow" }
Write-Host ""
Write-Host "Done: $success succeeded, $failed failed." -ForegroundColor $color
Write-Host "Delete the original .MOV files once you are happy with the results." -ForegroundColor DarkGray
