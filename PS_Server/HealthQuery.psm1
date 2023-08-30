#$machines=@("XADDC101U", "XADDC102", "XADIR01", "XALIC01", "XASFR01", "XASFR02", "XASFR101", "XASFR101U", "XASFR102", "XAVDA01", "XAVDA02", "XAVDA03", "XAVDA04", "XAVDA05", "XAVDA06", "XAVDA07", "XAVDA08", "XAVDA09", "XAVDA10", "XAVDA101", "XAVDA101U", "XAVDA102", "XAVDA102U", "XAVDA103", "XAVDA104", "XAVDA104U", "XAVDA105", "XAVDA106", "XAVDA107", "XAVDA108", "XAVDA109", "XAVDA11", "XAVDA110")
#$machines=get-content .\machines.txt
function get-Health{
[CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline=$true)]
        [string[]]$machines
    )
$connecting = @()
$notConnecting = @()
$notPinging = @()
$report=@()
foreach ($machine in $machines) {
    $status=$null
    $rebooted=$null
    $rebooted_days=$null
    $disks=$null
    $computerName = "$machine.m1.local"
    if (Test-Connection $machine -Count 1 -Quiet) {
        $session=New-PSSession -ComputerName $computername -Credential $cred -ErrorAction SilentlyContinue -SessionOption $proxy
        if($session){
            write-host "$machine`tConnected"
            $connecting += $session.computername
            $status="WinRM"
            $rebooted=Invoke-command -Session $session  -ScriptBlock{gcim -ClassName win32_operatingsystem | select -expandproperty lastbootuptime}
            $rebooted_days=((get-date)-$rebooted).days
            $disks = Invoke-command -Session $session -ScriptBlock{Get-WmiObject -Class Win32_LogicalDisk -Filter "DriveType=3"}
        }
        else{
            write-host "$machine`tNot Connected"
            $notConnecting += $machine
            $status="Only Pinging"
        }
    } elseif(!(Test-Connection $machine -Count 8 -Quiet)) {
        
        write-host "$machine`tNot Pinging"
        $notPinging += $machine
        $status="Not Reachable"
    }
    $Drives=@() #initiating empty Array    
    foreach ($disk in $disks) {
        $diskInfo = [PSCustomObject] @{
            DriveLetter = $disk.DeviceID
            FreeSpaceGB = [Math]::Round($disk.FreeSpace / 1GB, 2)
            TotalSpaceGB = [Math]::Round($disk.Size / 1GB, 2)
            }
        $Drives+=$diskInfo
        }
    $report+= [pscustomobject] @{
        Status=$status
        Uptime=$rebooted_days
        Disks=$Drives
        Computername=$machine
        LastUpdated=$(get-date -Format "dd-MM-yy hh:mm")
    }
}
return $report
}
<#
$result=$null
$result=get-health -machines @("xavda01","xavda02")

#"connecting : $connecting"
$date=get-date -Format "dd-MM-yy"
ConvertTo-Json -Depth 8 -InputObject $result| Out-File  "C:\users\ad_shalomp\downloads\Health_report_$date.json"

#$report | select @{l="a";E={$_.disks.deviceID}}#>


