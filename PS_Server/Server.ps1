$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:9097/")
$listener.Start()
$request_jobs=@()

$jobs=New-Object System.Collections.ArrayList
$job_info=New-Object System.Collections.ArrayList
$runspacePool = [runspacefactory]::CreateRunspacePool(1, [Environment]::ProcessorCount)
$runspacePool.Open()

try {
    while ($listener.IsListening) {
        Import-Module ".\ServerScript.psm1" -force  -variable script
        $context = $listener.GetContext()
        # job script

        # create and start the job
        $runspace = [PowerShell]::Create().AddScript($script).AddArgument($context).AddArgument($pwd).AddArgument($runspacePool).AddArgument($jobs).AddArgument($job_info)
        $runspace.runspacePool=$runspacePool
        $job=$runspace.BeginInvoke()
        $request_jobs+=[pscustomobject]@{
                                    runspace=$runspace
                                    job=$job
                                    context=$context
                                    path=$context.request.Url.LocalPath
                                    date=$(get-date);}


        # Release the job object from the event handler so it can be garbage collected properly
        # get the output, this line prints 42
        $request_jobs|foreach{
            if($_.job.Iscompleted){
                $_.runspace.Stop()
                $_.runspace.dispose()
                $date=get-date
                $duration=($date-$_.date).TotalSeconds
                "$(get-date) closing job on $($_.path) at $([Math]::round($duration,2)) seconds" >> .\request.log
                $_=$null
                
            }
        }

        #$process=get-process QuickcheckServer
        #if($process.PM/1MB -gt 900){
        #    get-process QuickcheckServer|Stop-Process -Force }
        #
        # show the changed live object (data = 3.14)
        #$liveObject
    }
}
finally {
    $runspace.Dispose()
    $runspacePool.Close()
    $runspacePool.Dispose()
    $listener.Stop()
    $listener.Close()
}
