Add-Type -AssemblyName System.Drawing

function Remove-WhiteBackground([string]$srcPath, [string]$dstPath, [int]$threshold = 245) {
    $fullSrc = Resolve-Path $srcPath
    $srcBmp = [System.Drawing.Bitmap]::FromFile($fullSrc)
    $dstBmp = New-Object System.Drawing.Bitmap($srcBmp.Width, $srcBmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $w = $srcBmp.Width
    $h = $srcBmp.Height

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $p = $srcBmp.GetPixel($x, $y)
            if ($p.R -ge $threshold -and $p.G -ge $threshold -and $p.B -ge $threshold) {
                $dstBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
            } else {
                $dstBmp.SetPixel($x, $y, $p)
            }
        }
    }

    $srcBmp.Dispose()
    $fullDst = [System.IO.Path]::Combine((Get-Location), $dstPath)
    $dstBmp.Save($fullDst, [System.Drawing.Imaging.ImageFormat]::Png)
    $dstBmp.Dispose()
    Write-Host "Created transparent PNG: $dstPath"
}

Remove-WhiteBackground "assets/lego_scale_chef.jpg" "assets/lego_figure_chef.png" 248
Remove-WhiteBackground "assets/lego_scale_installer.jpg" "assets/lego_figure_installer.png" 248
Remove-WhiteBackground "assets/lego_scale_architect.jpg" "assets/lego_figure_architect.png" 248
Remove-WhiteBackground "assets/lego_scale_coffee.jpg" "assets/lego_figure_coffee.png" 248
