function Get-KbsQuery{

    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline=$true)]
        [string]$ComputerName = "CHNMCT326806L"
    )
    $kbs=@()
    try {
        $Kbs = Invoke-command -computerName $ComputerName -SessionOption $proxy -Credential $cred -scriptBlock{Get-Hotfix | select HotFixID, Description,InstalledOn,InstalledBy}
    }
    catch {
        $err="couldn't connect to the server"
    }
    return [PSCustomObject]@{
        KbsArray = $Kbs
        Error=$err
    }
}