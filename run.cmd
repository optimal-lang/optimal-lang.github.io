call build.cmd
if not "%ERRORLEVEL%"  == "0" (
  exit /b 1
)
start http-server
sleep 6
start %USERPROFILE%\scoop\apps\googlechrome-dev\current\chrome.exe --incognito http://localhost:8080/ex-ball.html
