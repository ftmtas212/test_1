Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @'
using System;
using System.Drawing.Imaging;
using System.Runtime.Serialization;
public static class GifProps {
  public static PropertyItem Make(int id, short type, byte[] bytes) {
    var p = (PropertyItem)FormatterServices.GetUninitializedObject(typeof(PropertyItem));
    p.Id = id; p.Type = type; p.Len = bytes.Length;
    p.Value = bytes;
    return p;
  }
}
'@ -ReferencedAssemblies System.Drawing.dll,System.Runtime.Serialization.dll

$out = Join-Path $PSScriptRoot 'yunnan-journey-timeline-2026-10.gif'
$W=640; $H=360; $frames=150; $fps=10
$points = @(
  @('台北 TPE',25.08,121.23,8,'12:30'), @('廣州 CAN',23.39,113.30,8,'17:15'), @('昆明 KMG',25.10,102.93,8,'21:30'),
  @('斗南花市',24.91,102.79,9,'08:40'), @('大理古城',25.70,100.16,9,'14:40'), @('洱海 S 灣',25.78,100.16,9,'16:00'), @('喜洲古鎮',25.85,100.13,9,'17:15'),
  @('理想邦',25.71,100.28,10,'09:30'), @('文筆村',25.77,100.27,10,'11:30'), @('雙廊古鎮',25.94,100.19,10,'15:15'),
  @('知子羅',26.55,98.91,11,'13:30'), @('福貢',26.90,98.87,11,'18:00'), @('丙中洛',28.00,98.62,12,'13:00'), @('獨龍江',27.88,98.34,12,'18:30'),
  @('龍元村',27.85,98.33,13,'08:00'), @('普卡旺',27.92,98.33,13,'11:00'), @('怒江第一灣',27.97,98.62,13,'16:15'), @('六庫',25.85,98.86,13,'22:30'),
  @('麗江古城',26.87,100.23,14,'13:30'), @('白沙古鎮',26.95,100.22,14,'15:00'), @('文昌宮',26.88,100.23,14,'17:15'),
  @('長江第一灣',26.88,99.96,15,'09:00'), @('上虎跳峽',27.18,100.11,15,'11:00'), @('香格里拉',27.83,99.70,15,'14:00'), @('飛來寺',28.44,98.87,15,'19:00'),
  @('金沙江大拐彎',28.29,99.30,16,'09:30'), @('白馬雪山',28.35,99.08,16,'11:00'), @('普達措',27.83,99.96,16,'14:00'), @('昆明',25.04,102.71,16,'23:45'),
  @('昆明 KMG',25.10,102.93,17,'05:30'), @('廣州 CAN',23.39,113.30,17,'09:50'), @('台北 TPE',25.08,121.23,17,'13:30')
)
$titles = @('飛向雲南','花市與洱海','繞著洱海走','走進怒江山谷','越過山，抵達秘境','獨龍江的村落','古城慢時光','沿江向雪山','日照金山，再回昆明','帶著風景回家')
$minLat=23.0; $maxLat=29.0; $minLon=97.5; $maxLon=122.5
$mx=18; $my=52; $mw=420; $mh=250
function X([double]$lon){ return $script:mx + ($lon-$script:minLon)/($script:maxLon-$script:minLon)*$script:mw }
function Y([double]$lat){ return $script:my + ($script:maxLat-$lat)/($script:maxLat-$script:minLat)*$script:mh }
function Mix([double]$a,[double]$b,[double]$t){ return $a+($b-$a)*$t }
function Text($g,$s,$x,$y,$size,$color,$style=0){ $g.DrawString($s,(New-Object Drawing.Font('Microsoft JhengHei',$size,[Drawing.FontStyle]$style)),(New-Object Drawing.SolidBrush($color)),[float]$x,[float]$y) }

$images = New-Object System.Collections.Generic.List[System.Drawing.Bitmap]
for($f=0;$f -lt $frames;$f++){
  $q=$f/($frames-1); $stage=$q*10; $di=[Math]::Min(9,[int][Math]::Floor($stage)); $local=$stage-$di
  $day=8+$di; $dayPts=$points | Where-Object { $_[3] -eq $day }; if($dayPts.Count -lt 2){$dayPts=@($dayPts)}
  $si=[Math]::Min($dayPts.Count-2,[int][Math]::Floor($local*$dayPts.Count)); if($si -lt 0){$si=0}; $lt=($local*$dayPts.Count)-$si
  $a=$dayPts[$si]; $b=$dayPts[[Math]::Min($dayPts.Count-1,$si+1)]; if($dayPts.Count -eq 1){$b=$a;$lt=0}
  $lat=Mix $a[1] $b[1] $lt; $lon=Mix $a[2] $b[2] $lt
  $bmp=New-Object Drawing.Bitmap($W,$H); $g=[Drawing.Graphics]::FromImage($bmp); $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([Drawing.Color]::FromArgb(8,20,34)); $g.FillRectangle((New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(16,44,66))),$mx,$my,$mw,$mh)
  $grid=New-Object Drawing.Pen([Drawing.Color]::FromArgb(35,80,103),1); for($xx=$mx;$xx -le $mx+$mw;$xx+=29){$g.DrawLine($grid,$xx,$my,$xx,$my+$mh)}; for($yy=$my;$yy -le $my+$mh;$yy+=25){$g.DrawLine($grid,$mx,$yy,$mx+$mw,$yy)}
  Text $g '雲南十日行程' 18 14 19 ([Drawing.Color]::FromArgb(241,248,255)) 1; Text $g '2026.10.08 — 2026.10.17  ·  示意位置與估算時間' 18 37 9 ([Drawing.Color]::FromArgb(159,184,203))
  $route=New-Object Drawing.Pen([Drawing.Color]::FromArgb(100,214,195),3); $penDots=New-Object Drawing.Pen([Drawing.Color]::FromArgb(84,118,138),1)
  $vis=$points | Where-Object { $_[3] -lt $day -or ($_[3] -eq $day -and [array]::IndexOf($dayPts,$_) -le $si) }
  $prev=$null; foreach($p in $vis){$xx=X $p[2];$yy=Y $p[1];if($prev){$pxp=X $prev[2];$pyp=Y $prev[1];$g.DrawLine($route,[float]$pxp,[float]$pyp,[float]$xx,[float]$yy)};$g.FillEllipse((New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(184,247,233))),[float]$xx-3,[float]$yy-3,6,6);$prev=$p}
  if($prev){$pxp=X $prev[2];$pyp=Y $prev[1];$g.DrawLine($route,[float]$pxp,[float]$pyp,[float](X $lon),[float](Y $lat))}; $g.FillEllipse((New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(255,209,102))),([float](X $lon)-6),([float](Y $lat)-6),12,12)
  Text $g '昆明' ((X 102.71)+5) ((Y 25.04)-12) 9 ([Drawing.Color]::FromArgb(182,202,216)); Text $g '大理' ((X 100.16)+5) ((Y 25.70)-12) 9 ([Drawing.Color]::FromArgb(182,202,216)); Text $g '麗江' ((X 100.23)+5) ((Y 26.87)-12) 9 ([Drawing.Color]::FromArgb(182,202,216)); Text $g '香格里拉' ((X 99.70)+5) ((Y 27.83)-12) 9 ([Drawing.Color]::FromArgb(182,202,216)); Text $g '怒江' ((X 98.87)+5) ((Y 26.90)-12) 9 ([Drawing.Color]::FromArgb(182,202,216))
  $g.FillRectangle((New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(16,40,58))),458,52,164,250); Text $g 'CURRENT LOCATION' 474 70 8 ([Drawing.Color]::FromArgb(126,164,188)) 1; Text $g $titles[$di] 474 98 15 ([Drawing.Color]::FromArgb(244,248,251)) 1; Text $g $a[0] 474 127 12 ([Drawing.Color]::FromArgb(126,228,208)) 1; Text $g ('下一站  '+$b[0]) 474 155 10 ([Drawing.Color]::FromArgb(199,215,226)); Text $g ('10/'+$day+'  '+$a[4]) 474 181 10 ([Drawing.Color]::FromArgb(199,215,226)); Text $g ('行程日  '+($di+1)+' / 10') 474 207 10 ([Drawing.Color]::FromArgb(199,215,226));
  $g.FillRectangle((New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(10,27,42))),474,231,132,40); Text $g '時間軸進度' 483 245 8 ([Drawing.Color]::FromArgb(126,164,188)); Text $g ('約 '+[Math]::Round($q*100)+'%') 483 262 11 ([Drawing.Color]::FromArgb(244,248,251)) 1
  $line=New-Object Drawing.Pen([Drawing.Color]::FromArgb(49,81,103),3);$g.DrawLine($line,18,325,622,325);for($i=0;$i -lt 10;$i++){ $tx=18+604*($i/9);$col=if($i -le $di){[Drawing.Color]::FromArgb(100,214,195)}else{[Drawing.Color]::FromArgb(70,97,118)};$g.FillEllipse((New-Object Drawing.SolidBrush($col)),[float]$tx-3,322,6,6);Text $g ('10/'+(8+$i)) ($tx-12) 343 7 ([Drawing.Color]::FromArgb(159,184,203))}
  $g.FillEllipse((New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(255,209,102))),[float](18+604*$q)-5,320,10,10); Text $g '路線為行程示意，景點座標與部分時間為估算' 18 355 7 ([Drawing.Color]::FromArgb(111,141,160));
  $g.Dispose(); $images.Add($bmp)
}

$codec=[Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/gif'}
$ep=New-Object Drawing.Imaging.EncoderParameters(1); $ep.Param[0]=New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::SaveFlag,[long][Drawing.Imaging.EncoderValue]::MultiFrame)
$delay=New-Object byte[] 40; for($i=0;$i -lt 10;$i++){[BitConverter]::GetBytes([int]10).CopyTo($delay,$i*4)}; $loop=[BitConverter]::GetBytes([int]0)
$images[0].SetPropertyItem([GifProps]::Make(0x5100,4,$delay)); $images[0].SetPropertyItem([GifProps]::Make(0x5101,3,$loop)); $images[0].Save($out,$codec,$ep)
$ep.Param[0]=New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::SaveFlag,[long][Drawing.Imaging.EncoderValue]::FrameDimensionTime); for($i=1;$i -lt $images.Count;$i++){$images[0].SaveAdd($images[$i],$ep)}
$ep.Param[0]=New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::SaveFlag,[long][Drawing.Imaging.EncoderValue]::Flush); $images[0].SaveAdd($ep)
foreach($im in $images){$im.Dispose()}; Write-Output "Created $out"
