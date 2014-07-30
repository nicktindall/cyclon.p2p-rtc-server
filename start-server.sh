#!/bin/sh
if [ -n "$1" ]
	then 
	echo "Running on port $1"
	export PORT=$1
else
	echo "Running on default port"
fi

node ./node_modules/cyclon.p2p-rtc-server/server.js

