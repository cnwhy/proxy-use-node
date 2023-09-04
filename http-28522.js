// 本机转发内网 http 代理
const ps = require('./utils/proxyPort');
ps.proxyPortTCP(28522, '10.2.21.105', 28522);