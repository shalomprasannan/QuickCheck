$global:CopyScript={
    Param(
        $Query,
        [pscredential]$cred
    )
    function Copy-remote(){
        Param($query,[pscredential]$cred)
        $Source=$Query.Source
        $Destination=$Query.Destination
        $Machines=$Query.Machines
        $Recurse=$Query.Recurse
        $Rewrite=$Query.Rewrite
        $LiveUpdates=$Query.LiveUpdates
        $proxy=New-PSSessionOption -ProxyAccessType NoProxyServer
        foreach($machine in $machines){
            $status=""
            $Reason=""
            try{
                $session =new-pssession -ComputerName "$machine.m1.local" -SessionOption $proxy -ErrorAction stop -cred $cred
                Copy-Item -ToSession $session -Path $source -Destination $destination -Recurse:$recurse -ErrorAction Stop -Force:$rewrite
                $Status="Success"
                $reason="NA"
            }
            catch{
                $Status="Failed"
                $reason="$($error[0])"
                $error.clear()
            }
            finally{
                Remove-PSSession $session
                $update=[pscustomobject]@{
                    Machine=$machine
                    Status=$status
                    Reason=$Reason
                }
                $LiveUpdates.Add($update)|out-null
            }
        }
    }
    
    Copy-remote -Query $Query -cred $cred
    
    }

    