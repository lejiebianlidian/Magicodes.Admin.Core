﻿# 参数
param(
    # 配置文件
    $configPath = "tencentyun.config",
    # 用户名
    $script:tsUserName = "",
    # 密码
    $script:tsPassword = "",
    # Host镜像名称
    $script:tsImageHostName = "",
    # AppHost镜像名称
    $script:tsImageAppHostName = "",
    # UI镜像名称
    $script:tsImageUiName = "",
    # 不编译不执行打包
    $noBuild = $False,
    # 不创建Docker镜像（便于直接推送）
    $noCreateDocker = $False,
    # 调试模式，以输出配置参数
    $debug = $False,
    #是否推送
    $isPush = $True,
    #Host工程配置文件（存在即替换），用于Docker环境，建议传递自定义参数以便使用不同的配置来支持开发、测试和生成环境
    $hostConfigFile="appsettings.json",
    #Angular UI工程应用配置文件（存在即替换），用于Docker环境，建议传递自定义参数以便使用不同的配置来支持开发、测试和生成环境
    $appConfigFile="appconfig.json",
    #推送类型（ALL、HOST、APPHOST、NG）
    $pushType="ALL",
    #是否执行单元测试
    $runTest=$False,
    #镜像版本
    $script:imageVersion="latest"
)

# 路径变量
function prompt { '心莱科技: ' + (get-location) + '> '}

$invocation = (Get-Variable MyInvocation).Value
$buildFolder = Split-Path $invocation.MyCommand.Path
$slnFolder = [io.Directory]::GetParent($buildFolder);

$outputFolder = Join-Path $buildFolder "tsoutputs"
$webHostFolder = Join-Path $slnFolder "src/admin/api/Admin.Host"
$appHostFolder = Join-Path $slnFolder "src/app/api/App.Host"
$ngFolder = Join-Path $slnFolder "src/admin/ui"

function LogDebug {
    param (
        $message
    )
    if($debug)
    {
        Write-Host $message
    }
}

LogDebug "buildFolder:$buildFolder"
LogDebug "slnFolder:$slnFolder"
LogDebug "webHostFolder:$webHostFolder"
LogDebug "appHostFolder:$appHostFolder"
LogDebug "ngFolder:$ngFolder"
LogDebug "outputFolder:$outputFolder"
LogDebug "pushType:$pushType"

# 设置参数
function SetConfigFromFile {
    if (![String]::IsNullOrEmpty($configPath)) {
        Write-Host '从配置文件中获取配置'
        $config = @{}
        $path = [io.Path]::Combine($buildFolder, $configPath)
        if (![io.File]::Exists($path)) {
            $host.UI.WriteErrorLine('配置文件不存在，请定义！')
            return;
        }

        Get-Content -Path $path |
            Where-Object { $_ -like '*=*' } |
            ForEach-Object {
            $infos = $_ -split '='
            $key = $infos[0].Trim()
            $value = $infos[1].Trim()
            $config.$key = $value
        }

        $script:tsUserName = $config.tsUserName;
        $script:tsPassword = $config.tsPassword;
        $script:tsImageHostName = $config.tsImageHostName;
        $script:tsImageAppHostName = $config.tsImageAppHostName;
        $script:tsImageUiName = $config.tsImageUiName;
        $script:imageVersion= $config.imageVersion;
        LogDebug "tsUserName:$script:tsUserName"
        LogDebug "tsPassword:$script:tsPassword"
        LogDebug $script:tsImageHostName
        LogDebug $script:tsImageUiName
        LogDebug $script:SqlConnectionString
    }
}


## 清理 ######################################################################
function ClearOutputFolder {
    LogDebug "正在清理输出目录"
    Remove-Item $outputFolder -Force -Recurse -ErrorAction Ignore
    New-Item -Path $outputFolder -ItemType Directory
}


## 还原Nuget包 #####################################################
function RestoreSlnFolder {
    LogDebug "正在还原包"
    Set-Location $slnFolder
    dotnet restore
}


## 发布Host工程 ###################################################
function PublishWebHostFolder {
    if($runTest -eq $True)
    {
        LogDebug "正在执行单元测试"
        Set-Location (Join-Path $slnFolder "src/admin/api/Admin.Tests")
        # 执行单元测试
        # Start-Process -FilePath powershell -ArgumentList "dotnet test" -PassThru -ErrorAction Stop
       dotnet test
       if($lastexitcode -eq 1)
       {
            Write-Error "单元测试运行失败，已终止！"
            Set-Location $buildFolder
            exit;
       }
    }
    Set-Location $webHostFolder

    LogDebug "正在发布输出文件"
    dotnet publish --output (Join-Path $outputFolder "Host")
    if($lastexitcode -eq 1)
    {
        Write-Error "发布失败，已终止！"
        Set-Location $buildFolder
        exit;
    }

    $hostOutputPath = Join-Path $outputFolder "Host"

    LogDebug "正在复制docker/host相关配置"
    # 复制dockerfile等配置或想覆盖的自定义配置（比如运行时的dockerfile）
    Copy-Item (Join-Path $slnFolder "docker/host/*") $hostOutputPath

    if(![String]::IsNullOrEmpty($hostConfigFile))
    {
        $configFilePath=Join-Path $buildFolder $hostConfigFile;
        if([io.File]::Exists($configFilePath))
        {
            Copy-Item $configFilePath $hostOutputPath
            LogDebug "已成功覆盖Host配置文件"
        }else {
             Write-Host "配置文件${configFilePath}不存在"
        }
    }


}

## 发布AppHost工程 ###################################################
function PublishAppHostFolder {
    Set-Location $appHostFolder
    LogDebug "正在发布输出文件"
    dotnet publish --output (Join-Path $outputFolder "AppHost")
    if($lastexitcode -eq 1)
    {
        Write-Error "发布失败，已终止！"
        Set-Location $buildFolder
        exit;
    }

    $hostOutputPath = Join-Path $outputFolder "AppHost"

    LogDebug "正在复制docker/appHost"
    # 复制dockerfile等配置或想覆盖的自定义配置（比如运行时的dockerfile）
    Copy-Item (Join-Path $slnFolder "docker/appHost/*") $hostOutputPath
}

## 发布 ANGULAR UI 工程 #################################################
function PublicNgFolder {
    LogDebug "正在发布Angular工程"

    Set-Location $ngFolder
    & yarn
    & ng build --prod --configuration=production
    Copy-Item (Join-Path $ngFolder "dist") (Join-Path $outputFolder "ng/") -Recurse
    Copy-Item (Join-Path $ngFolder "Dockerfile") (Join-Path $outputFolder "ng")

    LogDebug "正在覆盖docker/ng 相关配置"
    # 复制nginx配置文件、SSL证书等
    Copy-Item (Join-Path $slnFolder "docker/ng/*.*") (Join-Path $outputFolder "ng")

    if(![String]::IsNullOrEmpty($appConfigFile))
    {
        $configFilePath=Join-Path $buildFolder $appConfigFile;
        if([io.File]::Exists($configFilePath))
        {
            Copy-Item $configFilePath (Join-Path $outputFolder "ng/assets/appconfig.production.json")
            LogDebug "已覆盖 ng/assets/appconfig.production.json 配置文件"
        }
    }
}


## 创建 DOCKER 镜像 #######################################################
function CreateDocker {
    LogDebug "正在创建相关镜像"
    if(($pushType -eq "ALL") -or ($pushType -eq "HOST"))
    {
        # Host
        Set-Location (Join-Path $outputFolder "Host")

        # docker rmi $tsImageHostName -f
        docker build ./ -t $tsImageHostName

        LogDebug "已创建$tsImageHostName"
    }
    if(($pushType -eq "ALL") -or ($pushType -eq "APPHOST"))
    {
        # AppHost
        Set-Location (Join-Path $outputFolder "AppHost")

        # docker rmi $tsImageAppHostName -f
        docker build ./ -t $tsImageAppHostName

        LogDebug "已创建$tsImageAppHostName"
    }
    if(($pushType -eq "ALL") -or  ($pushType -eq "NG"))
    {
        # Angular UI
        Set-Location (Join-Path $outputFolder "ng")

        # docker rmi $tsImageUiName -f
        docker build ./ -t $tsImageUiName

        LogDebug "已创建$tsImageUiName"
    }
}


## 推送Docker文件
function PushDockerImage {
    LogDebug "正在推送镜像"
    docker login --username $tsUserName --password $tsPassword ccr.ccs.tencentyun.com
    LogDebug "已登录，正在推送..."
    if(($pushType -eq "ALL") -or ($pushType -eq "HOST"))
    {
        docker push "${tsImageHostName}:${imageVersion}"
    }
    if(($pushType -eq "ALL") -or ($pushType -eq "APPHOST"))
    {
        docker push "${tsImageAppHostName}:${imageVersion}"
    }
    if(($pushType -eq "ALL") -or ($pushType -eq "NG"))
    {
        docker push "${tsImageUiName}:${imageVersion}"
    }
}

# 执行

#从配置文件读取变量
SetConfigFromFile
#判断是否需要编译
if (!$nobuild) {
    #清理输出目录
    ClearOutputFolder
    LogDebug "正在复制compose相关配置"
    Copy-Item (Join-Path $slnFolder "docker/compose/*.*") $outputFolder
    if(($pushType -eq "ALL") -or  ($pushType -eq "HOST"))
    {
        #还原包
        RestoreSlnFolder
        #发布Host工程
        PublishWebHostFolder
    }
    if(($pushType -eq "ALL") -or  ($pushType -eq "APPHOST"))
    {
        #还原包
        RestoreSlnFolder
        #发布Host工程
        PublishAppHostFolder
    }
    if(($pushType -eq "ALL") -or  ($pushType -eq "NG"))
    {
        #发布Angular前端工程
        PublicNgFolder
    }
}
#判断是否需要创建Docker镜像
if(!$noCreateDocker)
{
    #创建Docker镜像
    CreateDocker
}
#推送Docker镜像
PushDockerImage
Set-Location $buildFolder