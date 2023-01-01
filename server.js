const http = require('http');
const url = require('url');
const Router = require('./controller/router')
const NotFound = require('./controller/handle/notFoundRouting')
const fs = require('fs')
const typeFile = {
    'jpg': 'images/jpg',
    'png': 'images/png',
    'js': 'text/javascript',
    'css': 'text/css',
    'svg': 'image/svg+xml',
    'ttf': 'font/tff',
    'woff': 'font/woff',
    'woff2': 'font/woff',
    'eot': 'application/vnd.ms-fontobject'
}

const sever = http.createServer((req, res) => {
    let pathName = url.parse(req.url, true).pathname;
    const checkPath = pathName.match(/\.js|\.css|\.png|\.jpg|\.ttf|\.woff|\.woff2|\.eot/);
    if (checkPath) {
        const contentType = typeFile[checkPath[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': contentType});
        fs.createReadStream(__dirname + req.url).pipe(res);
    } else {
        const arrPath = pathName.split('/');
        let trimPath = '';
        if (arrPath.length > 2) {
            trimPath = arrPath[1] + '/' + arrPath[2]
        } else {
            trimPath = arrPath[arrPath.length - 1];
        }
        let chosenHandle;
        if (typeof Router[trimPath] === 'undefined') {
            chosenHandle = NotFound.notFound;
        } else {
            chosenHandle = Router[trimPath];
        }
        chosenHandle(req, res, +arrPath[3]);
    }
})
sever.listen(8080, () => {
    console.log(`sever running !!!`)
})