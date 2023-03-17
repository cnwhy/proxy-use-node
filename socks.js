const socks5 = require('node-socks5-server');
const server = socks5.createServer();
server.listen(9091, '0.0.0.0');