// node 启用一个 socks5 服务示例
const socks5 = require('node-socks5-server');
/**
 * 启动简单的socks5代理服务
 * @param {number} port 代理端口
 * @param {string} hostname
 */
module.exports = function(port, hostname){
    hostname = hostname || '0.0.0.0';
    const server = socks5.createServer();
    server.listen(port, hostname);
}