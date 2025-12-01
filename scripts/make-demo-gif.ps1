# Requires ffmpeg installed and available in PATH
# Usage:
# 1) Record a short MP4 of the template demo (Start → Quick Save → Gallery → Close Gallery)
# 2) Place it next to this script as input.mp4 or pass -Input "C:\\path\\to\\file.mp4"
# 3) Run this script; it writes templates/minimal/public/media/demo.gif
param(
  [string]$Input = "input.mp4",
  [string]$Output = "templates/minimal/public/media/demo.gif",
  [int]$Fps = 12,
  [int]$Width = 640
)

function Fail($msg){ Write-Host $msg -ForegroundColor Red; exit 1 }

# Validate ffmpeg
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if(-not $ffmpeg){ Fail "ffmpeg not found in PATH. Install from https://ffmpeg.org/download.html" }

# Validate input
if(-not (Test-Path $Input)){ Fail "Input file not found: $Input" }

# Ensure output directory exists
$destDir = Split-Path -Parent $Output
if(-not (Test-Path $destDir)){ New-Item -ItemType Directory -Path $destDir | Out-Null }

# Convert MP4 to optimized GIF (palettegen + paletteuse)
# Notes:
# - fps: smoothness vs size (8–15 is reasonable)
# - scale: width, keep aspect via -1 height
# - dither: bayer to reduce banding

$vf = "fps=${Fps},scale=${Width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=full[p];[s1][p]paletteuse=new=1:dither=bayer:bayer_scale=5"

Write-Host "Generating GIF..." -ForegroundColor Cyan
ffmpeg -y -i "$Input" -vf $vf -loop 0 "$Output"

if($LASTEXITCODE -ne 0){ Fail "ffmpeg conversion failed." }

# Optional: show file size
$sizeKB = [Math]::Round((Get-Item $Output).Length / 1KB)
Write-Host "Done: $Output (${sizeKB} KB)" -ForegroundColor Green
