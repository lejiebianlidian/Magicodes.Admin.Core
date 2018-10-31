﻿# 路径变量
function prompt { '心莱科技: ' + (get-location) + '> '}

$invocation = (Get-Variable MyInvocation).Value
$buildFolder = Split-Path $invocation.MyCommand.Path
$slnFolder = [io.Directory]::GetParent($buildFolder);

$outputFolder = Join-Path $buildFolder "outputs"
$webHostFolder = Join-Path $slnFolder "src/admin/api/Admin.Host"
$ngFolder = Join-Path $slnFolder "src/admin/ui"

Write-Host $buildFolder
Write-Host $slnFolder
Write-Host $webHostFolder
Write-Host $ngFolder
Write-Host $outputFolder

## 清理 ######################################################################

Remove-Item $outputFolder -Force -Recurse -ErrorAction Ignore
New-Item -Path $outputFolder -ItemType Directory

## 还原Nuget包 #####################################################

Set-Location $slnFolder
dotnet restore

## 发布Host工程 ###################################################

Set-Location $webHostFolder
dotnet publish --output (Join-Path $outputFolder "Host")

## 发布 ANGULAR UI 工程 #################################################

Set-Location $ngFolder
& yarn
& ng build --prod
Copy-Item (Join-Path $ngFolder "dist") (Join-Path $outputFolder "ng/") -Recurse
Copy-Item (Join-Path $ngFolder "Dockerfile") (Join-Path $outputFolder "ng")

# Change UI configuration
$ngConfigPath = Join-Path $outputFolder "ng/assets/appconfig.json"
(Get-Content $ngConfigPath) -replace "22742", "9901" | Set-Content $ngConfigPath
(Get-Content $ngConfigPath) -replace "4200", "9902" | Set-Content $ngConfigPath

## 创建 DOCKER 镜像 #######################################################

# Host
Set-Location (Join-Path $outputFolder "Host")

## docker rmi magicodes/host -f
docker build ./ -t magicodes/admin.host

# Angular UI
Set-Location (Join-Path $outputFolder "ng")

## docker rmi magicodes/ng -f
docker build ./ -t magicodes/admin.ui

## DOCKER COMPOSE 文件 #######################################################

Copy-Item (Join-Path $slnFolder "docker/ng/*.*") $outputFolder
Set-Location $outputFolder
