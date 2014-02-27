var
    http = require('http'),
    bindHost, bindPort;

bindHost = process.env.APP_HOST || '127.0.0.1';
bindPort = process.env.APP_PORT || 1271;

 function formatLog (req, res, body) {
    body = typeof body === 'string' ? body : '';

    var dateTime = /Date: ([A-z0-9:, ]+)/.exec(res._header)[1];

    return req.connection.remoteAddress
        + ' - - [ ' + dateTime + ' ] "'
        + req.method + ' '
        + req.url + ' HTTP/' + req.httpVersionMajor + '.' + req.httpVersionMinor + '" '
        + res.statusCode + ' '
        + (res._header.length + body.length);
}

http.createServer(function (req, res) {
    var
        userAgent = req.headers['user-agent'],
        addr = req.connection.remoteAddress;

    res.on('finish', function () {
        console.log(formatLog(req, res, res.statusCode === 200 ? addr : ''));
    });

    if (/(curl|wget)/.test(userAgent)) {
        res.setHeader('Content-Type', 'text/plain');
    } else {
        res.setHeader('Content-Type', 'text/html');
    }

    if (req.url !== '/') {
        res.writeHead(404, 'Not Found');

        return res.end();
    } else {
        res.writeHead(200);
    }

    //console.log(res);

    return res.end(addr);
}).listen(bindPort, bindHost);

console.log('Server running at http://' + bindHost + ':' + bindPort + '/');