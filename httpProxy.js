const http = require("http");
const net = require('net');
const url = require("url");
const httpProxy = require("http-proxy");

const port = 9090;
const proxy = httpProxy.createProxyServer({});

http.createServer().on('request',function (req, res) {
    const Url = url.parse(req.url)
    console.log(Url.href);
    // proxy.web(req, res, { target: Url.protocol + '//' + Url.host });
    proxy.web(req, res, {
        target: Url.protocol + '//' + Url.host,
        followRedirects: true,
        ws: true,
    });
}).on('connect', function(cReq, cSock){
    const Url = url.parse('http://' + cReq.url);
    console.log('cReq', cReq.url);
    const pSock = net.connect(Url.port, Url.hostname, function () {
        cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        pSock.pipe(cSock);
    }).on('error', function (e) {
        cSock.end();
    });
    cSock.pipe(pSock);
}).listen(port, '0.0.0.0', function () {
    console.log('http proxy start at ', port);
});