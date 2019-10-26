#!/bin/sh

cd /home/pi/

## Update / Upgrade Raspbian Image
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install -y git npm

# Install
# gcc g++ make

## Install pm2
sudo npm install pm2 -g
sudo npm install prebuild-install -g

## Download SMARTNAV-RTK
git clone https://github.com/aircool00/SMARTNAV-RTK.git

## Install rtklibexplorer RTKLIB
git clone -b demo5 https://github.com/rtklibexplorer/RTKLIB.git
cd ./RTKLIB/app/str2str/gcc/
make
cd ../../rtkrcv/gcc/
make


## Install RTKLIB-RTKRCV, RTKLIB-STR2STR, RTKLIB-SERVER, WebConsole Services
cd SMARTNAV-RTK/Software/webconsole

## Install RTKLIB-RTKRCV
cd RTKLIB-RTKRCV && npm install && cd ..

## Install RTKLIB-SERVER
cd RTKLIB-Server && npm install && cd ..

## Install RTKLIB-STR2STR
cd RTKLIB-STR2STR && npm install && cd ..

## Install WebConsole
cd RTKLIB-WebConsole && npm install && cd .. 
