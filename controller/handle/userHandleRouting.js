const fs = require('fs')
const qs = require('qs')
const UserService = require('../../service/userService')
const cookie = require('cookie')

class UserHandleRouting {
    login (req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/login.html', 'utf-8', async (err, loginHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(loginHtml);
                    res.end();
                }
            })
        } else {
            let data ='';
            req.on ('data', chuck => {
                data += chuck;
            })
            req.on ('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let user = qs.parse(data);
                    let users = await UserService.login(user);
                    if (users.length !== 0) {
                        res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify(users[0]), {
                            httpOnly: true,
                            maxAge: 60 * 60 * 24 * 7
                        }));
                        res.writeHead(301 , {'location':'/home'})
                        res.end();
                    } else {
                        res.writeHead(301 , {'location':'/login'})
                        res.end();
                    }
                }
            })
        }
    }
    signUp(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/signUp.html', 'utf-8', async (err, signUpHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(signUpHtml);
                    res.end();
                }
            })
        } else {
            let data = '';
            req.on('data', chuck => {
                data += chuck;
            })
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let user = qs.parse(data);
                     await UserService.signUp(user);
                    res.writeHead(301 , {'location':'/login'})
                    res.end();
                }
            })
        }
    }
}

module.exports = new UserHandleRouting();