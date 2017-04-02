#!/bin/bash

SERVER_ENV_NAME=server_environment

echo 'Installing Requirements';
apt-get update;

echo 'Checking if Python 3 Installed...';
if [ $(dpkg-query -W -f='${Status}' python3 2>/dev/null | grep -c "ok installed") -eq 0 ]
then
  echo 'Installing Python3';
  apt-get install python3;
fi

if [ $(dpkg-query -W -f='${Status}' python3-dev 2>/dev/null | grep -c "ok installed") -eq 0 ]
then
  apt-get install python3-dev;
fi

if [ $(dpkg-query -W -f='${Status}' python3.4-venv 2>/dev/null | grep -c "ok installed") -eq 0 ]
then
  apt-get install python3.4-venv;
fi

if [ $(dpkg-query -W -f='${Status}' mysql-server 2>/dev/null | grep -c "ok installed") -eq 0 ]
then
  echo "mysql-server"
  apt-get install mysql-server
fi

if [ $(dpkg-query -W -f='${Status}' libmysqlclient-dev 2>/dev/null | grep -c "ok installed") -eq 0 ]
then
  apt-get install libmysqlclient-dev
fi

echo 'Checking if npm Installed...';
if [ $(dpkg-query -W -f='${Status}' npm 2>/dev/null | grep -c "ok installed") -eq 0 ]
then
  echo 'Installing npm';
  apt-get install npm
fi

echo "Creating python 3 virtual environment and installing requirements"
python3 -m venv $SERVER_ENV_NAME
source $SERVER_ENV_NAME/bin/activate
pip3 install -r requirements.txt

echo "Python requirements installed. Running server.."
chmod +x server/application.py
python3 server/application.py &

echo "Server started";
echo "Installing npm packages";
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
source ~/.profile
nvm install v7.7.3
nvm use 7.7.3
npm install

echo "Starting Client App...";
npm start &

python3 -mwebbrowser http://localhost:5000

echo "If a web browser was not opened, navigate to http://localhost:5000 to begin using the application";
