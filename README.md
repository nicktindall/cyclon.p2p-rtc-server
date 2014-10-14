cyclon.p2p-rtc-server
=====================

[![Build Status](https://travis-ci.org/nicktindall/cyclon.p2p-rtc-server.svg?branch=master)](https://travis-ci.org/nicktindall/cyclon.p2p-rtc-server)
[![Dependencies](https://david-dm.org/nicktindall/cyclon.p2p-rtc-server.png)](https://david-dm.org/nicktindall/cyclon.p2p-rtc-server)

The signalling server for the [cyclon.p2p](https://github.com/nicktindall/cyclon.p2p) WebRTC abstraction.

Usage
-----
First install the package using npm

```
npm install cyclon.p2p-rtc-server
```

Then execute the server on a port of your choosing with the following command line

```
./node_modules/.bin/cyclon-signalling-server 12345
```

Where 12345 can be any port number you want to make the server available on. Once running you can include the signalling server in the configuration of a node by specifying it as:

```javascript
{
    'socket': {
        'server': 'http://your.host.name:12345'
    },
    'signallingApiBase':'http://your.host.name:12345' 
}

```

There is a corresponding client available [here](https://github.com/nicktindall/cyclon.p2p-rtc-client)