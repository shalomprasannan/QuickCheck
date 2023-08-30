function Get-DiskQuery{

    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline=$true)]
        [string]$ComputerName = "CHNMCT326806L"
    )
    try {
        $disks = Invoke-command -computerName $ComputerName -SessionOption $proxy -Credential $cred -scriptBlock{Get-WmiObject -Class Win32_LogicalDisk -Filter "DriveType=3"}
    }
    catch {
        $err="couldn't connect to the server"
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
    return [PSCustomObject]@{
        Drives = $Drives
        Error=$err
    }
}