# WS Aruba WebSocket Lib
1) Download "https://github.com/angkarns/ArubaSocketServer" sourcecode and extract to C:\
   >> Change sql-connection-ip-address in server.js file (Line 121)
2) Downlaod and install nodejs "https://nodejs.org/en/download"
3) Install Node Packet Manager
  > cd c:\ArubaSocketServer
  > npm install
4) enable Windows-Subsystem via Windows Power Shell (Run as Administrator)
  > cd \
  > dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
  > dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
  > wsl --update
  > wsl --set-default-version 2
5) Install Ubuntu on Windows Store
6) Install docker for windows desktop "https://hub.docker.com/editions/community/docker-ce-desktop-windows/"
   >> Change Docker desktop Resource/WLS-Integration Setting to "Ubuntu"
7) Download "https://github.com/angkarns/ArubaPhpDocker" sourcecode and extract to C:\
   >> Change sql-connection-ip-address in server.php file
8) Install Apache-PHP
  > cd c:\ArubaPhpDocker
  > docker run -d -p 80:80 --name my-apache-php-app -v C:\ArubaPhpDocker:/var/www/html php:7.2-apache
9) Install PHP-extension
  > docker ps
  > docker exec -ti <your-php-container> sh
   # docker-php-ext-install mysqli 
   # docker-php-ext-enable mysqli
   # apachectl restart
10) Install MySql
  > docker run --name iot-mysql -e MYSQL_ROOT_PASSWORD=root00-- -e MYSQL_DATABASE=iot -e TZ=Asia/Bangkok -p 3306:3306 -d mysql:8.0.33
11) Install phpMyAdmin
  > docker run --name phpmyadmin -d --link iot-mysql:db -p 8081:80 phpmyadmin
12) phpMyAdmin (http://localhost:8081)> Edit or Add new sql-root-user password to "Native-MySql-Authentication"
13) phpMyAdmin (http://localhost:8081)> import "sql_cli\iot-table.sql" file to "iot" database
14) Setup iot profile in Aruba WiFi (supported both AOS and Instant AP)
15) start NodeJS
  > node server.js
16) Add New Tags (http://localhost/tags) 
17) Add Floor Plan (http://localhost/uploadimagefile) 
18) Register new Admin/User account. (http://localhost)
19) Search Tags Location (http://localhost)
