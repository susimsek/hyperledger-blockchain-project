docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)
rm -rf ~/.composer
cd fabric-dev-servers/
./downloadFabric.sh
./startFabric.sh
./createPeerAdminCard.sh
cd ../
composer network install --card PeerAdmin@hlfv1 --archiveFile clp-network@0.0.1.bna
composer network start --networkName clp-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file networkadmin.card
composer network ping --card admin@clp-network
cd blockchain-explorer/
./start.sh
cd ../
cd web-app/
npm start