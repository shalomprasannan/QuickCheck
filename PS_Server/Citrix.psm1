function Get-Vda{
[CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline=$true)]
        [string]$Vda_Name = ""
    )

    $vda_Info=Invoke-command -ComputerName xaddc01.m1.local -SessionOption $proxy -Credential $cred -ScriptBlock{
        Add-PSSnapin Citrix*
        $vda=Get-BrokerDesktop -MachineName "M1\$using:Vda_Name" -ErrorAction SilentlyContinue
        [pscustomobject]@{
        MachineName=$vda.MachineName
        Status=$vda.RegistrationState
        Sessions=$vda.AssociatedUserNames.count
        }
    }

    #to get real count, but very slow, use jobs
    $realcount=Invoke-Command -computername "$Vda_Name.m1.local" -SessionOption $proxy -ScriptBlock {
        $quser=quser
        $loggedOnUsers = ($quser | Select-Object -Skip 1 | ForEach-Object { 
                                if(($_ -split '\s+')[0][0] -eq '>'){
                                ($_ -split '\s+')[0].substring(1) }
                                else{
                                ($_ -split '\s+')[1] 
                                }})
        return $loggedOnUsers.count
    }

    return $vda_Info|select @{l="RealCount";e={$realcount}},* -ExcludeProperty PSComputerName, RunspaceId 
}

function Get-AllVda{
    
    $vda_Info=Invoke-command -ComputerName xaddc01.m1.local -Credential $cred -SessionOption $proxy -ScriptBlock{
        Add-PSSnapin Citrix*
        $vda=Get-BrokerDesktop -ErrorAction SilentlyContinue|select MachineName,@{l="RegistrationState";e={if($_.RegistrationState -eq "Registered"){"Registered"}else{"Unregistered"}}},@{l="Sessions";e={$_.AssociatedUserNames.count}},IPAddress
        return $vda
        }

    $vdas=$vda_Info|select * -ExcludeProperty PSComputerName, RunspaceId
    $moc=$vdas|where {$_.IPAddress -like "10.22*"}
    $roc=$vdas|where {$_.IPAddress -eq $null}|where {$_.MachineName -notlike "S-*"}
    
    return [pscustomobject]@{
        Moc=$moc
        Roc=$roc
    }
}

function Get-User{
[CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline=$true)]
        [string]$username = ""
    )

    $user=Invoke-command -ComputerName xaddc01.m1.local -SessionOption $proxy -ScriptBlock{
        Add-PSSnapin citrix*
        Get-BrokerSession -UserName "M1\$using:username"|select ApplicationsInuse,MachineName,Username
    }
    #try catch method to avoid non terminating error -erroraction silently continue
    try{
        $ADUser=Get-ADUser -Identity $username -Properties Lockedout  -ErrorAction SilentlyContinue
        }
    catch{
    }

    return $user|select @{l="Account";e={@('Not Locked','Locked')[$Aduser.Lockedout]}},*  -ExcludeProperty PSComputerName, RunspaceId

}

function get-QuickAllApps{
    Invoke-command -ComputerName xaddc01.m1.local -SessionOption $proxy -Credential $cred -ScriptBlock  {
        Add-PSSnapin citrix*
        get-brokerapplication -Enabled $true -SortBy PublishedName -MaxRecordCount 1000 -Property publishedName,Uid,IconUid|foreach{
            [pscustomobject]@{
                AppName=$_.PublishedName
                Uid=$_.Uid
                IconUid=$_.IconUid
            }
        }
    }
}
function get-AllApps{
    Invoke-command -ComputerName xaddc01.m1.local -SessionOption $proxy -Credential $cred -ScriptBlock  {
        Add-PSSnapin citrix*
        function get-Apps{
            $apps=@()
            $apps+=get-brokerapplication -Enabled $true -SortBy PublishedName -MaxRecordCount 1000 -Property publishedName,Uid,IconUid|foreach{
                $machines=(Get-BrokerDesktop -ApplicationUid $_.Uid -Property MachineName).count
                if($machines -gt 0){
                    $sessions=Get-BrokerSession -ApplicationUid $_.Uid -Property SessionId
                    [pscustomobject]@{
                        AppName=$_.PublishedName
                        Uid=$_.Uid
                        IconUid=$_.IconUid
                        Sessions=$sessions.count
                        Machines=$machines
                    }
                }else{return}
            }
            return $apps
        }
        get-Apps
    }|select * -ExcludeProperty PSComputerName,RunspaceId,PSShowComputerName
}

function get-AppInfo{
    param([Parameter(mandatory=$true)]$AppUid)
    Invoke-command -ComputerName xaddc01.m1.local -SessionOption $proxy -Credential $cred -ScriptBlock  {
        Param($AppUid)
        Add-PSSnapin Citrix*
    function get-App{
    param([Parameter(mandatory=$true)]$AppUid)
    
    $vdas=@()
    $vdas+=Get-BrokerDesktop -ApplicationUid $AppUid -Property MachineName,RegistrationState |foreach{
        $sessions=(Get-BrokerSession -ApplicationUid $AppUid -MaxRecordCount 1000 |where machineName -eq $_.MachineName).count
        [pscustomobject]@{
        MachineName=$_.MachineName
        RegistrationState=@("Registered","Unregistered")[$_.RegistrationState -eq "unregistered"]
        Sessions=$sessions
            }
        }
        return $vdas
    }
    get-App -appUid $AppUid
} -ArgumentList $AppUid|select * -ExcludeProperty PSComputerName,RunspaceId,PSShowComputerName
}
    
    
    # $Icons = Get-BrokerIcon -Property uid,EncodedIconData
    # foreach($icon in $icons){
    #     $bytes=[System.Convert]::FromBase64String($icon.EncodedIconData)
    #     set-Content -Encoding Byte -Value $bytes -Path "c:\temp\icon$($icon.uid).ico" }