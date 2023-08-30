$global:script={
    param($context,$pwd,$runspacePool,$jobs,$job_info)
    #temp snapins
    #Add-PSSnapin citrix*

    import-module "$pwd\ComputerQuery.psm1" -force -verbose -function Get-ComputerInfo
    import-module "$pwd\DiskQuery.psm1" -force -verbose -function Get-DiskQuery
    import-module "$pwd\ServicesQuery.psm1" -force -verbose -function Get-ServicesQuery
    import-module "$pwd\KbsQuery.psm1" -force -verbose -function Get-KbsQuery
    import-module "$pwd\HealthQuery.psm1" -force -verbose -function get-Health
    import-module "$pwd\Citrix.psm1" -force -verbose -function Get-AllVda,get-AllApps,get-Appinfo,get-QuickAllApps
    Import-Module "$pwd\Copy.psm1" -force  -variable CopyScript
    
    #generic data assignment
    #Start-Transcript -Path ".\TranscriptFile.txt"

    #"$env:USERNAME" >>C:\Users\ad_shalomp\Documents\quick_check\quick-check\Server\log.txt
    write-host "Shalom"
    $request=$context.Request
    $response=$context.Response
    $path = $context.request.Url.LocalPath
    $file = Join-Path "$pwd\dist" "$path"
    #$path>c:\users\ad_shalomp\downloads\logs.txt
    #$request|convertto-json > .\a.txt
    $StreamReader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
    $Request_input = $StreamReader.ReadToEnd()
    $request_cookies=@{}                
    $global:proxy=New-PSSessionOption -ProxyAccessType NoProxyServer
    foreach ($cookie in $request.cookies) {
        $cookieName = $cookie.Name
        $cookieValue = $cookie.Value
        $request_cookies.add($cookieName, $cookieValue)
        }
    $cred_user=$request_cookies.SessionUser
    $cred_pass=[System.Web.HttpUtility]::UrlDecode($request_cookies.SessionId)
    $cred_Pass= $cred_pass| ConvertTo-SecureString -AsPlainText -Force
    $global:cred = New-Object System.Management.Automation.PSCredential($cred_user, $cred_pass)
    $Query="$Request_input.m1.local"
    $Query

    function Send-Response($data){
        $json = $data|convertTo-json -Depth 100
        $buffer = [Text.Encoding]::UTF8.GetBytes($json)
        $response.ContentLength64 = $buffer.length
        $response.OutputStream.Write($buffer, 0, $buffer.length)
        $response.OutputStream.Flush()
        $response.Close()
    }

    function Send-Raw($data){
        $buffer = [Text.Encoding]::UTF8.GetBytes($data)
        $response.ContentLength64 = $buffer.length
        $response.OutputStream.Write($buffer, 0, $buffer.length)
        $response.OutputStream.Flush()
        $response.Close()
    }

    function Set-ContentType($file) {
        $extension = [System.IO.Path]::GetExtension($file)
        switch ($extension.ToLower()) {
            ".html" { $Type = "text/html" }
            ".js" { $Type = "text/javascript" }
            ".css" { $Type = "text/css" }
            ".png" { $Type = "image/png" }
            ".jpg" { $Type = "image/jpeg" }
            ".jpeg" { $Type = "image/jpeg" }
            ".gif" { $Type = "image/gif" }
            ".ico" { $Type = "image/ico" }
            ".svg" { $Type = "image/svg+xml" }
            default { $Type = "application/octet-stream" }
        }
        $response.ContentType = $Type
    }

    
    if($path -match "^/api"){
        switch ($path){
            #Computer Query
            {$_ -match "/computerQuery"}{
                $data = Get-ComputerInfo $Query
                send-Response $data
                break
                # break
            }
            {$_ -match "/diskQuery"}{
                $data = Get-DiskQuery $Query
                send-Response $data
                break
            }
            #ServicesQuery
            {$_ -match "/servicesQuery"}{
                $data = Get-ServicesQuery $Query
                send-Response $data
                break
            }
            {$_ -match "/kbsQuery"}{
                $data = Get-KbsQuery $Query
                send-Response $data
                break
            }
            {$_ -match "/reboot"}{
                $data = "$Request_input rebooted"
                send-Response $data
                break
            }

            {$_ -match "/jobs"}{
                switch($_){
                    {$_ -match "/get"}{
                        if(-not($jobs)){
                            $data=[pscustomobject]@{Message="there are no Jobs to view"}
                        }else{
                            $data=$job_info
                        }
                        send-Response $data
                        break
                    }

                    {$_ -match "/clearOne"}{
                        $id=$Request_input
                        $jobs|where id -eq $id|foreach{
                            $jobs.remove($_)
                        }
                        $job_info|where id -eq $id|foreach{
                            $job_info.remove($_)
                        }
                        if(-not($job_info)){
                            $data=[pscustomobject]@{Message="there are no Jobs to view"}
                        }else{
                            $data=$job_info
                        }
                        send-response $data
                        break
                    }

                    {$_ -match "/clearAll"}{
                        $jobs|foreach{
                            $_.instance.Stop()
                            $_.instance.Diapose()
                        }
                        $jobs.clear()
                        $job_info.clear()
                        if(-not($jobs)){
                            $data=[pscustomobject]@{Message="Jobs are cleared successfully"}
                        }else{
                            $data=$job_info
                        }
                        send-Response $data
                        break
                    }
                    {$_ -match "/stop"}{
                        $id=$Request_input
                        $current_job=$jobs|where id -eq $id
                        $current_job.instance.stop()
                        $jobs|where id -eq $id|foreach{
                            $_.Status="Stopped"
                        }
                        $job_info|where id -eq $id|foreach{
                            $_.Status="Stopped"
                        }
                        $data=$job_info 
                        send-Response $data
                        break
                    }
                    Default{
                        send-Response "reach /get or /clearAll"
                        break
                    }
                }
                
            }

            {$_ -match "/copy"}{
                $error.clear()
                $data = ConvertFrom-Json -InputObject $Request_input

                $instance=[Powershell]::Create()
                $instance.RunspacePool=$runspacePool
                $instance.AddScript($CopyScript)

                $parameters=@{
                    Id="$($instance.InstanceId.Guid)"
                    Name=$data.JobTag
                    Source=$data.Source
                    Destination=$data.Destination
                    Machines=$data.Machines -split ","
                    Recurse=$data.Recurse
                    Rewrite=$data.Rewrite
                    LiveUpdates=New-Object System.Collections.ArrayList
                    Username=$cred_user
                }
                
                $instance.AddArgument($parameters)
                $instance.AddArgument($cred)
                $invoke=$instance.BeginInvoke()
                $inst=@{
                    Id=$instance.InstanceId.Guid
                    Instance=$instance
                    ResultObj=$invoke
                    Status=$invoke.Iscompleted
                }
                #$parameters|Add-Member -Name "ResultObj" -Value $instance.BeginInvoke() -MemberType NoteProperty
                $parameters["Status"]="Running"
                $parameters["inst_Status"]=$invoke
                $jobs.Add($inst)
                $job_info.Add($parameters)
                Send-Response $parameters
                break
                }
            
            

            {$_ -match "/CreateSnap"}{
                $data = ConvertFrom-Json -InputObject $Request_input
                $notInVMware = @()
                $success = @()
                $machines=$data.machines.split(",").trim()|foreach{if($_.length -gt 0){return $_}}
                $name=$data.Sname
                $description=$data.SDesc
                $memory=$data.FlagMemory
                $Delete=$data.FlagDeleteExist
                $hostServers = @("mocvcms11.m1.local","rocvcms11.m1.local")
                Connect-VIServer -Server $hostServers -ErrorAction Ignore -Credential $cred -AllLinked
                foreach($machine in $machines){
                    if(Get-VM $machine -erroraction silentlycontinue){
                        #get-snapshot -VM $machine|Remove-Snapshot -RunAsync -Confirm:$true
                        if($Delete){
                            $snap=Get-Snapshot -VM $machine -ErrorAction Ignore
                            Remove-Snapshot -Snapshot $snap -RunAsync -Confirm:$false -ErrorAction Ignore}
                        New-Snapshot $machine -Name $name -Description $description -RunAsync -Memory:$memory
                        $success+=$machine
                    }
                    else{
                        write-host "$Machine doesn't exist"
                        $notInVMware+=$machine
                    }
                }
                $data=[PSCustomObject]@{
                    notInVmware = $notInVMware
                    success = $success
                }
                send-Response $data
                break
            }
            {$_ -match "/deleteSnap"}{
                $hostServers = @("mocvcms11.m1.local","rocvcms11.m1.local")
                Connect-VIServer -Server $hostServers -ErrorAction Ignore -Credential $cred -AllLinked
                $reqData = ConvertFrom-Json -InputObject $Request_input
                $vms=get-vm -Name $reqData
                $delSnaps=Get-Snapshot -VM $vms
                $error > .\log.txt
                $vms > .\a.txt
                $delSnaps| remove-snapshot -RunAsync -Confirm:$false 
                $data=[pscustomobject]@{
                    Message="Delete jobs has been initiated for below machines, please check after Sometime $($reqData -join ", ")"
                }
                Send-Response $data
                
            }

            {$_ -match "/getSnap"}{
                $hostServers = @("mocvcms11.m1.local","rocvcms11.m1.local")
                Connect-VIServer -Server $hostServers -ErrorAction Ignore -Credential $cred -AllLinked
                $data=@()
                $snaps=Get-Snapshot -vm *
                $data+=$snaps|foreach{
                    [pscustomobject]@{
                        VMName=$_.VM.Name
                        SName=$_.name
                        SDesc=$_.Description
                        Days=($(get-date)-$_.Created).Days
                        Size=$_.SizeGB
                        OS=@("Not Found",$_.VM.Guest.OSFullName)[[bool]$_.VM.Guest.OSFullName]
                    }
                }
                send-Response $data
                break
            }
            {$_ -match "/credtest"}{
                $p={Get-Service
                    gcim -ClassName Win32_OperatingSystem}
                $data = Invoke-Command -ComputerName mercury102.m1.local -Credential $cred -SessionOption $proxy -ScriptBlock{whoami}
                send-Response $data
                break
            }

        #Citrix Routes
            {$_ -match "/AllVda"}{
                $data = Get-AllVda
                send-Response $data
                break
            }

            {$_ -match "/AllXenApp"}{
                $data = get-AllApps
                send-Response $data
                break
            }

            {$_ -match "/QuickAllXenApp"}{
                $data = get-QuickAllApps
                send-Response $data
                break
            }

            {$_ -match "/XenAppInfo"}{
                $Request_input > .\a.txt
                $data = get-AppInfo -appUid $Request_input
                $data >> .\a.txt
                send-Response $data
                break
            }

            {$_ -match "/login"}{
                $urlEncodedString=$Request_input
                $parse=@{}
                $values=$urlEncodedString.split('&')
                foreach($value in $values){
                    $temp=$value.split("=")
                    $val=[System.Web.HttpUtility]::UrlDecode($temp[1])
                    $parse.add($temp[0],$val)
                }
                
                #New-Object DirectoryServices.DirectoryEntry "",$parse.username,$parse.password|select * >>.\d.txt
                if((New-Object DirectoryServices.DirectoryEntry "", $parse.username, $parse.password).psbase.name -ne $null){
                    $data=$parse
                }
                else{
                    $data=@{Error="Invalid Credentials"}
                 }
                # $request_cookies >> .\b.txt
                # $parse|convertto-json >>.\a.txt
                send-response $data
                break
            }

            {$_ -match "/manage"}{
                $data = Get-KbsQuery $Query
                send-Response $data
                break
            }

            {$_ -match "/HealthQuery"}{
                if($query.Replace(".m1.local","")){
                    $machine=$Query.Split('.')[0]
                    $one_result=get-health -machines $machine
                    "$one_result">>"$pwd\log.txt"
                    $result=get-content "$pwd\Health_report_*.json"|ConvertFrom-Json 
                    $result|where {$_.Computername -eq $one_result.Computername}|foreach{
                        $_.computername = $one_result.computername
                        $_.Status = $one_result.Status
                        $_.Disks=$one_result.Disks
                        $_.Uptime = $one_result.Uptime
                        $_.LastUpdated = $one_result.LastUpdated}
                    $date=get-date -Format "dd-MM-yy"
                    $result| ConvertTo-Json -depth 9|out-file  "$pwd\Health_report_$date.json"
                }
                $content = Get-Content "$pwd\Health_report_*.json" -Raw
                Set-ContentType($content)
                Send-Raw($content)
                break
            }
            Default{
                $data="<a href='/api/computerQuery'>Please reach a valid path</a>"
                send-Raw $data
                break
            }
        }
    }
    elseif($path -eq '/'){
        $content = Get-Content "$file\index.html"
        Send-Raw($content)
    }
    elseif (Test-Path $file){ 
        # Serve up the requested static file
        $extension = [System.IO.Path]::GetExtension($file)
        $extension
        if ($extension -match "\.(html|css|js|json|svg)$") {
            # Serve up the requested static file
            $content = Get-Content $file -Raw -Encoding UTF8
            Set-ContentType($file)  #Custom function
            Send-Raw($content) #Custom function
        } elseif ($extension -match "\.(png|jpe?g|gif|ico)$") {
            # Serve up the requested image file
            Set-ContentType($file)  #Custom function
            $content = [System.IO.File]::ReadAllBytes($file)
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            $response.OutputStream.Flush()
            $response.Close()
        }
    }
    else{
        $content = Get-Content "$pwd\dist\index.html"
        Send-Raw $content
    }
}