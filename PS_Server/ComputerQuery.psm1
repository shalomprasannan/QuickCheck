function Get-ComputerInfo{

    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline=$true)]
        [string]$ComputerName = "mercury102.m1.local"
    )
    
    $errorReceived=''
    $data=@{}
    try {
        $Query_Block={
        $ipAddress = Resolve-DnsName "$using:computerName" -Type A | select -ExpandProperty IPAddress
        $os =Get-CimInstance -Class Win32_OperatingSystem 
        $model=(Get-WmiObject -Class Win32_ComputerSystem ).Model
        $serialNo=Get-WmiObject -Class Win32_BIOS  | Select -ExpandProperty SerialNumber
        $quser=quser
        $loggedOnUsers = ($quser | Select-Object -Skip 1 | ForEach-Object { 
                                if(($_ -split '\s+')[0][0] -eq '>'){
                                ($_ -split '\s+')[0].substring(1) }
                                else{
                                ($_ -split '\s+')[1] 
                                }})
        $servicePack = $os.ServicePackMajorVersion
        $buildNumber = $os.BuildNumber
        $lastBootTime = $os.LastBootUpTime
        $computerName = $os.CSName

        return [PSCustomObject]@{
            ComputerName = @("",$computerName)[[bool]$computerName]
            IPAddress = @("",$ipAddress)[[bool]$ipAddress]
            OperatingSystem = @("", $os.Caption)[[bool]$os.Caption]
            ServicePack = @("", $servicePack)[[bool]$servicePack]
            Build = @("", $buildNumber)[[bool]$buildNumber]
            LastBootTime = @("", $lastBootTime)[[bool]$lastBootTime]
            Model= @("",$model)[[bool]$model]
            SerialNo= @("",$serialNo)[[bool]$serialNo]
            LoggedOnUsers= @("",$loggedOnUsers)[[bool]$loggedOnUsers]
            Error= $errorReceived
        }
        }
        $data=Invoke-Command -ComputerName $computername -Credential $cred -SessionOption $proxy -ScriptBlock $Query_Block
    
    }
    catch {
        $errorReceived="couldn't reach the server"
    }
    $data.Error=$errorReceived
    $data.PSComputerName=$null
    $data.RunspaceId=$null

    $newData=[pscustomobject]@{}
    $newData = $data | Select-Object * -ExcludeProperty PSComputerName, RunspaceId, PSShowComputerName

    return $newData

}