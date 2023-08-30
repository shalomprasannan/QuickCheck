$a=New-PSSessionOption -ProxyAccessType NoProxyServer
$session=New-PSSession -ComputerName PSDNETCC01.m1.local -SessionOption $a
copy-item -Path C:\users\ad_shalomp\Downloads\TeamsSetup_c_w_.exe -Destination C:\temp\  -tosession $session
