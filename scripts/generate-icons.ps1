<#
Generate raster icons (PNG/ICO) from the SVG assets using ImageMagick.
Run this from the repository root in PowerShell (pwsh):

  cd path\to\noormujassim
  .\scripts\generate-icons.ps1

Requirements:
- ImageMagick installed and the `magick` command available on PATH.
- PowerShell 7+ or Windows PowerShell

This script will generate:
- assets/umbrella-icon-192.png
- assets/umbrella-icon-512.png
- assets/favicon.ico (contains 48x48 and 32x32 sizes)

If ImageMagick is not installed, the script will print instructions.
#>

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path (Join-Path $repoRoot '..')
Set-Location $repoRoot

$assets = Join-Path $repoRoot 'assets'
$svg512 = Join-Path $assets 'umbrella-icon-512.svg'
$svg192 = Join-Path $assets 'umbrella-icon-192.svg'
$faviconSvg = Join-Path $assets 'favicon.svg'
$out192 = Join-Path $assets 'umbrella-icon-192.png'
$out512 = Join-Path $assets 'umbrella-icon-512.png'
$outFavicon32 = Join-Path $assets 'favicon-32.png'
$outFavicon48 = Join-Path $assets 'favicon-48.png'
$outIco = Join-Path $assets 'favicon.ico'

function Has-Command($name){
  $cmd = Get-Command $name -ErrorAction SilentlyContinue
  return $null -ne $cmd
}

if(-not (Has-Command 'magick')){
  Write-Host "ImageMagick 'magick' not found on PATH."
  Write-Host "Install ImageMagick (https://imagemagick.org) and ensure 'magick' is available, then re-run this script."
  exit 1
}

try{
  if(Test-Path $svg512){
    Write-Host "Generating 512x512 PNG..."
    magick convert "$svg512" -background transparent -resize 512x512 "$out512"
  } else {
    Write-Host "Warning: $svg512 not found. Skipping 512 generation."
  }

  if(Test-Path $svg192){
    Write-Host "Generating 192x192 PNG..."
    magick convert "$svg192" -background transparent -resize 192x192 "$out192"
  } else {
    Write-Host "Warning: $svg192 not found. Skipping 192 generation."
  }

  # Fallback favicon generation from the 512 svg if favicon.svg missing
  $srcForFavicon = if(Test-Path $faviconSvg) { $faviconSvg } elseif(Test-Path $svg512) { $svg512 } else { $null }
  if($srcForFavicon){
    Write-Host "Generating favicon sizes (48x48, 32x32) and favicon.ico..."
    magick convert "$srcForFavicon" -background transparent -resize 48x48 "$outFavicon48"
    magick convert "$srcForFavicon" -background transparent -resize 32x32 "$outFavicon32"
    magick convert "$outFavicon48" "$outFavicon32" -background transparent "$outIco"
  } else {
    Write-Host "No source SVG found for favicon; skipping favicon generation."
  }

  Write-Host "Icon generation completed. Files placed in: $assets"
} catch {
  Write-Host "Icon generation failed: $_"
  exit 2
}
