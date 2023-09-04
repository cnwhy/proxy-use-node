/**
 * 用node实现一个http代理
 */
const http = require("http");
const net = require('net');
const url = require("url");
const HttpProxy = require("http-proxy");
/**
 * 
 * @param {number} port 代理端口
 * @param {string} hostname
 */
module.exports = function httpProxy(port, hostname){
    hostname = hostname || '0.0.0.0'
    const proxy = HttpProxy.createProxyServer({});
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
        // https 走 connect 请求
        const Url = url.parse('http://' + cReq.url);
        console.log('cReq', cReq.url);
        const pSock = net.connect(Url.port, Url.hostname, function () {
            cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
            pSock.pipe(cSock);
        }).on('error', function (e) {
            cSock.end();
        });
        cSock.pipe(pSock);
    }).listen(port, hostname, function () {
        console.log('http proxy start at ', port);
    });
}