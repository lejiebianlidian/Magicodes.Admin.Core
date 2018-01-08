:: 包搜索字符串
echo %1
:: 项目方案地址
echo %2

:: 删除历史包
del %1 /f /q /a 

:: 包名称
set nupkg=""

:: 打包
dotnet pack %2 -c Release --output ../../tools/pack/nupkgs

:: 更新包名称
for %%a in (dir /s /a /b "./nupkgs/%1") do (set nupkg=%%a)

:: 推送包
nuget push nupkgs/%nupkg% oy2eozchsd7tst7ykoaayq7oqwwehi5unkm2lwg2o7ysyu -Source https://www.nuget.org/api/v2/package