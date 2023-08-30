function Get-ServicesQuery{

    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline=$true)]
        [string]$ComputerName = "CHNMCT326806L"
    )
    try {
        $Services = invoke-command -ComputerName $computerName -SessionOption $proxy -Credential $cred -scriptBlock{Get-Service}
    }
    catch {
        $err="couldn't connect to the server"
    }
    return [PSCustomObject]@{
        Services = $Services
        Error=$err
    }
}