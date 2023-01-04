const fs = require('fs')
const qs = require('qs')
const UserService = require('../../service/userService')
const PostService = require('../../service/postService');
const FriendShipService = require ('../../service/friendshipService')
const cookie = require('cookie')
const formidable = require('formidable');
const path = require("path");

class UserHandleRouting {
    login(req, res) {
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
            let data = '';
            req.on('data', chuck => {
                data += chuck;
            })
            req.on('end', async (err) => {
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
                        res.writeHead(301, {'location': '/user/pageUser'})
                        res.end();
                    } else {
                        res.writeHead(301, {'location': '/user/login'})
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
                    res.writeHead(301, {'location': '/user/login'})
                    res.end();
                }
            })
        }
    }
    static getPageUser(posts, indexHtml) {
        let tbody = '';
        posts.map((post, index) => {
            tbody += `
            <div class="col-sm-12" style="margin-top: 30px; margin-bottom: 10px">
              <div class="row align-items-start">
                <div class="col-sm-5 container text-center text-white">
                  <div class="container text-center">
                     <div class="row align-items-start">
                      <div class="col-sm-1" style="text-align: left; padding: 0">
                          <div class="container"><img src="/public/${post.userImage}" alt="Khong Co"  class="rounded-circle" alt="Quantrimang.com" width="50" height="auto"></div>
                       </div>
                       <div class="col-sm-9" style="text-align: left; padding: 0">
                          <h4 ><a href="" style="text-decoration: none; color: white">${post.fullName}</a></h4> <p style="font-size: 12px ">${post.fullName} đang cảm thấy : ${post.status}</p>
                          <span style="font-size: 10px ">${post.createTime}</span>
                       </div>
                        <div class="col-sm-2" style="text-align: right; padding: 0;color: #1a1a1a">
                          <td><a href="/posts/editPosts/${post.idPost}" title="Chỉnh Sửa" class="btn btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></a></td> 
                          <td><button type="button" class="btn btn-secondary" title="Xóa" data-bs-toggle="modal" data-bs-target="#staticBackdrop${post.idPost}"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/></svg></button>
                    <div class="modal fade secondary" id="staticBackdrop${post.idPost}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                 <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                     </div>
                                     <div class="modal-body">Có Xóa Không</div>
                                            <div class="modal-footer">
                                                 <a href="/user/home"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Không</button></a>
                                            <form action="/posts/delete/${post.idPost}" method="post"><button type="submit" class="btn btn-primary">Có</button></form>
                                             </div>
                                         </div>
                                    </div>
                               </div></td>
                          </div>
                       <div class=" text-white" style="overflow-wrap: break-word;  text-align: left; padding: 0; margin-top: 5px">
                        <p>${post.content}</p>
                       </div>
                     </div>
                   </div>
                    <div><img src="/public/${post.imagePost}" height="600px" width="auto""></div>
                    <div style="text-align: left; margin-top: 20px"><button type="button" class="btn btn-outline-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/></svg> Thích </button></div>
                </div>
              </div>
            </div>`
        })
        indexHtml = indexHtml.replace('{post}', tbody)
        return indexHtml;
    }
    static getPageFriend(posts, indexHtml) {
        let tbody = '';
        posts.map((post, index) => {
            tbody += `
            <div class="col-sm-12" style="margin-top: 30px">
              <div class="row align-items-start">
                <div class="col-sm-5 container text-center text-white">
                  <div class="container text-center">
                     <div class="row align-items-start">
                      <div class="col-sm-1" style="text-align: left; padding: 0">
                          <div class="container"><img src="/public/${post.userImage}" alt="Khong Co"  class="rounded-circle" alt="Quantrimang.com" width="50" height="auto"></div>
                       </div>
                       <div class="col-sm-9" style="text-align: left; padding: 0">
                          <h4 ><a href="" style="text-decoration: none; color: white">${post.fullName}</a></h4> <p style="font-size: 12px ">${post.fullName} đang cảm thấy : ${post.status}</p>
                          <span style="font-size: 10px ">${post.createTime}</span>
                       </div>                       
                       <div class=" text-white" style="overflow-wrap: break-word;  text-align: left; padding: 0; margin-top: 5px">
                        <p>${post.content}</p>
                       </div>
                     </div>
                   </div>
                    <div><img src="/public/${post.imagePost}" height="600px" width="auto""></div>
                </div>
              </div>
            </div>`
        })
        indexHtml = indexHtml.replace('{post}', tbody)
        return indexHtml;
    }
    static getImageEdit(images, editHtml) {
        let tbody = '';
        images.map((image, index) => {
            tbody += `
            <img src="/public/${image.userImage}" alt="Khong Co"  class="rounded-circle"alt="Quantrimang.com" width="100" height="auto">
            `
        })
        editHtml = editHtml.replace('{image}', tbody);
        return editHtml;
    }
    editUser(req, res) {
        const cookies = cookie.parse(req.headers.cookie || '');
        let userCurrent = JSON.parse(cookies.user);
        let id = userCurrent.id
        if (req.method === 'GET') {
            fs.readFile('./views/user/editInfo.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err)
                } else {

                    let user = await UserService.findById(id)
                    editHtml = UserHandleRouting.getImageEdit(user, editHtml);
                    editHtml = editHtml.replace('{fullName}', user[0].fullName);
                    editHtml = editHtml.replace('{userName}', user[0].userName);
                    editHtml = editHtml.replace('{password}', user[0].password);
                    editHtml = editHtml.replace('{userEmail}', user[0].userEmail);
                    editHtml = editHtml.replace('{birthday}', user[0].birthday);
                    editHtml = editHtml.replace('{age}', user[0].age);
                    editHtml = editHtml.replace('{id}', id);
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            })
        } else {
            let editData = '';
            req.on('data', chuck => {
                editData += chuck;
            })
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let user = qs.parse(editData);
                    let data = await UserService.editUser(user, id)
                    res.writeHead(301, {'location': `/user/pageUser`});
                    res.end();
                }
            })
        }
    }
    editImage(req, res, id) {
        if (req.method === 'POST') {
            let form = new formidable.IncomingForm();
            form.parse(req, async function (err, fields, files) {
                if (err) {
                    console.log(err)
                }
                let tmpPath1 = files.img.filepath;
                let newPath1 = path.join(__dirname, '..', '..', "public", files.img.originalFilename);
                await fs.readFile(newPath1, (err) => {
                    if (err) {
                        fs.copyFile(tmpPath1, newPath1, (err) => {
                            if (err) throw err;
                        });
                    }
                })
                await UserService.editImage(files.img.originalFilename, id)
                res.writeHead(301, {'location': '/user/editInfo'})
                res.end();
            });
        } else {
            fs.readFile('./views/user/formEditImage.html', 'utf-8', async (err, upLoadHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(upLoadHtml);
                    res.end();
                }
            })
        }
    }
    static getPage(posts, indexHtml) {
        let tbody = '';
        posts.map((post, index) => {
            tbody += `
            <div class="col-sm-12" style="margin-top: 30px">
              <div class="row align-items-start">
                <div class="col-sm-5 container text-center text-white">
                  <div class="container text-center">
                     <div class="row align-items-start">
                      <div class="col-sm-2" style="text-align: left; padding: 9% 0">
                          <div class="container"><img src="/public/${post.userImage}" alt="Khong Co"  class="rounded-circle"alt="Quantrimang.com" width="100" height="auto"></div>
                       </div>
                       <div class="col-sm-6" style="text-align: left; padding: 12% 0">
                          <h1>${post.fullName}</h1>
                            <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-at-fill" viewBox="0 0 16 16"><path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z"/><path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Email: ${post.userEmail}</p>
                          <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-balloon-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.49 10.92C19.412 3.382 11.28-2.387 8 .986 4.719-2.387-3.413 3.382 7.51 10.92l-.234.468a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.235-.468ZM6.726 1.269c-1.167-.61-2.8-.142-3.454 1.135-.237.463-.36 1.08-.202 1.85.055.27.467.197.527-.071.285-1.256 1.177-2.462 2.989-2.528.234-.008.348-.278.14-.386Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Ngày Sinh: ${post.birthday}</p>
                          <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Tuổi: ${post.age}</p>
                       </div>
                        <div class="col-sm-4" style="text-align: right; padding:13% 0">
                          <a href="/user/editInfo/${post.id}"><button type="button" class="btn btn-outline-secondary text-white" >Chỉnh Sửa Thông Tin</button></a>
                        </div>
                  </div>  
                </div>
              </div>`
        })
        indexHtml = indexHtml.replace('{user}', tbody)
        return indexHtml;
    }
    static showFormStranger(friends, indexHtml) {
        let tbody = '';
        friends.map((post, index) => {
            tbody += `
            <div class="col-sm-12" style="margin-top: 30px">
              <div class="row align-items-start">
                <div class="col-sm-5 container text-center text-white">
                  <div class="container text-center">
                     <div class="row align-items-start">
                      <div class="col-sm-2" style="text-align: left; padding: 9% 0">
                          <div class="container"><img src="/public/${post.userImage}" alt="Khong Co"  class="rounded-circle"alt="Quantrimang.com" width="100" height="auto"></div>
                       </div>
                       <div class="col-sm-6" style="text-align: left; padding: 12% 0">
                          <h1>${post.fullName}</h1>
                            <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-at-fill" viewBox="0 0 16 16"><path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z"/><path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Email: ${post.userEmail}</p>
                          <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-balloon-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.49 10.92C19.412 3.382 11.28-2.387 8 .986 4.719-2.387-3.413 3.382 7.51 10.92l-.234.468a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.235-.468ZM6.726 1.269c-1.167-.61-2.8-.142-3.454 1.135-.237.463-.36 1.08-.202 1.85.055.27.467.197.527-.071.285-1.256 1.177-2.462 2.989-2.528.234-.008.348-.278.14-.386Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Ngày Sinh: ${post.birthday}</p>
                          <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Tuổi: ${post.age}</p>
                       </div>
                        <div class="col-sm-4" style="text-align: right; padding:13% 0">
                          <a href=""><button type="button" class="btn btn-outline-secondary text-white" >Kết Bạn</button></a>
                        </div>
                  </div>  
                </div>
              </div>`
        })
        indexHtml = indexHtml.replace('{user}', tbody)
        return indexHtml;
    }
    static showFormConfirm(friends, indexHtml) {
        let tbody = '';
        friends.map((post, index) => {
            tbody += `
            <div class="col-sm-12" style="margin-top: 30px">
              <div class="row align-items-start">
                <div class="col-sm-5 container text-center text-white">
                  <div class="container text-center">
                     <div class="row align-items-start">
                      <div class="col-sm-2" style="text-align: left; padding: 9% 0">
                          <div class="container"><img src="/public/${post.userImage}" alt="Khong Co"  class="rounded-circle"alt="Quantrimang.com" width="100" height="auto"></div>
                       </div>
                       <div class="col-sm-6" style="text-align: left; padding: 12% 0">
                          <h1>${post.fullName}</h1>
                            <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-at-fill" viewBox="0 0 16 16"><path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z"/><path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Email: ${post.userEmail}</p>
                          <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-balloon-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.49 10.92C19.412 3.382 11.28-2.387 8 .986 4.719-2.387-3.413 3.382 7.51 10.92l-.234.468a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.235-.468ZM6.726 1.269c-1.167-.61-2.8-.142-3.454 1.135-.237.463-.36 1.08-.202 1.85.055.27.467.197.527-.071.285-1.256 1.177-2.462 2.989-2.528.234-.008.348-.278.14-.386Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Ngày Sinh: ${post.birthday}</p>
                          <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Tuổi: ${post.age}</p>
                       </div>
                        <div class="col-sm-4" style="text-align: right; padding:13% 0">
                          <a href="/friend/confirm/${post.id}"><button type="button" class="btn btn-outline-secondary text-white" >Chấp Nhận</button></a>
                        </div>
                  </div>  
                </div>
              </div>`
        })
        indexHtml = indexHtml.replace('{user}', tbody)
        return indexHtml;
    }
    static showFormFriend(friends, indexHtml) {
        let tbody = '';
        friends.map((post, index) => {
            tbody += `
            <div class="col-sm-12" style="margin-top: 30px">
              <div class="row align-items-start">
                <div class="col-sm-5 container text-center text-white">
                  <div class="container text-center">
                     <div class="row align-items-start">
                      <div class="col-sm-2" style="text-align: left; padding: 9% 0">
                          <div class="container"><img src="/public/${post.userImage}" alt="Khong Co"  class="rounded-circle"alt="Quantrimang.com" width="100" height="auto"></div>
                       </div>
                       <div class="col-sm-6" style="text-align: left; padding: 12% 0">
                          <h1>${post.fullName}</h1>
                            <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-at-fill" viewBox="0 0 16 16"><path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z"/><path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Email: ${post.userEmail}</p>
                          <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-balloon-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.49 10.92C19.412 3.382 11.28-2.387 8 .986 4.719-2.387-3.413 3.382 7.51 10.92l-.234.468a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.235-.468ZM6.726 1.269c-1.167-.61-2.8-.142-3.454 1.135-.237.463-.36 1.08-.202 1.85.055.27.467.197.527-.071.285-1.256 1.177-2.462 2.989-2.528.234-.008.348-.278.14-.386Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Ngày Sinh: ${post.birthday}</p>
                          <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/></svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg> Tuổi: ${post.age}</p>
                       </div>
                        <div class="col-sm-4" style="text-align: right; padding:13% 0">
                          <a href="/friend/delete/{id}"><button type="button" class="btn btn-outline-secondary text-white" >Hủy Kết Bạn</button></a>
                        </div>
                  </div>  
                </div>
              </div>`
        })
        indexHtml = indexHtml.replace('{user}', tbody)
        return indexHtml;
    }
    static showPage(req, res) {
        fs.readFile('./views/user/userPage.html', 'utf-8', async (err, userHtml) => {
            if (err) {
                console.log(err)
            } else {
                const cookies = cookie.parse(req.headers.cookie || '');
                let userCurrent = JSON.parse(cookies.user);
                let id = userCurrent.id
                let users = await UserService.findById(id)
                userHtml = UserHandleRouting.getPage(users, userHtml)
                userHtml = userHtml.replace('{fullName}', users[0].fullName);
                userHtml = userHtml.replace('{userName}', users[0].userName);
                userHtml = userHtml.replace('{password}', users[0].password);
                userHtml = userHtml.replace('{userEmail}', users[0].userEmail);
                userHtml = userHtml.replace('{birthday}', users[0].birthday);
                userHtml = userHtml.replace('{age}', users[0].age);
                let posts = await PostService.showPage(id)
                users = UserHandleRouting.getPageUser(posts, userHtml)
                res.writeHead(200, 'text/html');
                res.write(users);
                res.end();
            }
        })
    }
    static showPageConfirm(req, res, id) {
        fs.readFile('./views/user/userPage.html', 'utf-8', async (err, confirmHtml) => {
            if (err) {
                console.log(err)
            } else {
                let users = await UserService.findById(id)
                confirmHtml = UserHandleRouting.showFormConfirm(users, confirmHtml)
                confirmHtml = confirmHtml.replace('{fullName}', users[0].fullName);
                confirmHtml = confirmHtml.replace('{userName}', users[0].userName);
                confirmHtml = confirmHtml.replace('{password}', users[0].password);
                confirmHtml = confirmHtml.replace('{userEmail}', users[0].userEmail);
                confirmHtml = confirmHtml.replace('{birthday}', users[0].birthday);
                confirmHtml = confirmHtml.replace('{age}', users[0].age);
                let posts = await PostService.showPage(id)
                users = UserHandleRouting.getPageFriend(posts, confirmHtml)
                res.writeHead(200, 'text/html');
                res.write(users);
                res.end();
            }
        })
    }
    static showPageFriend(req, res, id) {
        fs.readFile('./views/user/userPage.html', 'utf-8', async (err, friendHtml) => {
            if (err) {
                console.log(err)
            } else {
                let users = await UserService.findById(id)
                friendHtml = UserHandleRouting.showFormFriend(users, friendHtml)
                friendHtml = friendHtml.replace('{fullName}', users[0].fullName);
                friendHtml = friendHtml.replace('{userName}', users[0].userName);
                friendHtml = friendHtml.replace('{password}', users[0].password);
                friendHtml = friendHtml.replace('{userEmail}', users[0].userEmail);
                friendHtml = friendHtml.replace('{birthday}', users[0].birthday);
                friendHtml = friendHtml.replace('{age}', users[0].age);
                let posts = await PostService.showPage(id)
                users = UserHandleRouting.getPageFriend(posts, friendHtml)
                res.writeHead(200, 'text/html');
                res.write(users);
                res.end();
            }
        })

    }
    static showPageStranger(req, res, id) {
        fs.readFile('./views/user/userPage.html', 'utf-8', async (err, strangerHtml) => {
            if (err) {
                console.log(err)
            } else {
                let users = await UserService.findById(id)
                strangerHtml = UserHandleRouting.showFormStranger(users, strangerHtml)
                strangerHtml = strangerHtml.replace('{fullName}', users[0].fullName);
                strangerHtml = strangerHtml.replace('{userName}', users[0].userName);
                strangerHtml = strangerHtml.replace('{password}', users[0].password);
                strangerHtml = strangerHtml.replace('{userEmail}', users[0].userEmail);
                strangerHtml = strangerHtml.replace('{birthday}', users[0].birthday);
                strangerHtml = strangerHtml.replace('{age}', users[0].age);
                let posts = await PostService.showPage(id)
                users = UserHandleRouting.getPageFriend(posts, strangerHtml)
                res.writeHead(200, 'text/html');
                res.write(users);
                res.end();
            }
        })
    }
   async checkIdFormUser(req, res, id) {
       const cookies = cookie.parse(req.headers.cookie || '');
       let userCurrent = JSON.parse(cookies.user);
       let idC = userCurrent.id
          if (isNaN(id) || idC == id) {
            await UserHandleRouting.showPage(req, res);
        } else {
          let a = await FriendShipService.checkStatus(id)
            if (a[0].status === 'stranger') {
                UserHandleRouting.showPageStranger(req, res, id)
            } else if (a[0].status  === 'confirm') {
                UserHandleRouting.showPageConfirm(req, res, id)
            } else {
                UserHandleRouting.showPageFriend(req, res, id)
            }

        }
    }
}

module.exports = new UserHandleRouting();