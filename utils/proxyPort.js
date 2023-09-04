// 端口转发
const net = require('net');
const dgram = require('dgram');

/**
 * TCP和UDP端口转发
 * @param {number} srcPort 本地端口
 * @param {string} destServer 要转发的服务器
 * @param {number} destPort 要代理的端口
 */
function proxyPort(srcPort, destServer, destPort) {
    proxyPortTCP(srcPort, destServer, destPort);
    proxyPortUDP(srcPort, destServer, destPort);
}

/**
 * tcp端口转发
 * @param {number} srcPort 本地端口
 * @param {string} destServer 要转发的服务器
 * @param {number} destPort 要代理的端口
 */
function proxyPortTCP(srcPort, destServer, destPort) {
    const tcpServer = net.createServer(function (cSock) {
        proxyClientTCP(cSock, destServer, destPort)
    });
    tcpServer.listen(srcPort, function () {
        console.log('tcp开始转发', `${srcPort} -> ${destServer}:${destPort}`);
    });
}

/**
 * udp端口转发
 * @param {*} srcPort 本地端口
 * @param {*} destServer 要转发的服务器
 * @param {*} destPort 要代理的端口
 */
function proxyPortUDP(srcPort, destServer, destPort) {
    const udpServer = dgram.createSocket('udp4').on('error', (err) => {
        console.log('udp server err', err)
    })
    udpServer.bind(srcPort, function () {
        proxyClientUDP(udpServer, destServer, destPort);
        console.log('udp开始转发', `${srcPort} -> ${destServer}:${destPort}`);
    });
}

// udp转发
function proxyClientUDP(server, destServer, destport) {
    server.on('message', (msg, rinfo) => {
        const client = dgram.createSocket('udp4')
        client.on('message', (msg, fbRinfo) => {
            server.send(msg, rinfo.port, rinfo.address);
            client.close();
        })
        client.on('error', (err) => {
            console.log('udp client err', err)
            client.close();
        })
        client.send(msg, destport, destServer);
    })
}

// tcp转发
function proxyClientTCP(server, destServer, destport) {
    const client = net.connect({ port: destport, host: destServer }, function () {
        client.pipe(server);
        server.pipe(client);
    }).on('error', function (err) {
        console.log("tcp client err", err);
        server.end();
    })
    server.on('error', function (err) {
        console.log("tcp server err", err);
        client.destroy();
    });
}

module.exports = {
    proxyPort,
    proxyPortTCP,
    proxyPortUDP,
    proxyClientTCP,
    proxyClientUDP,
}