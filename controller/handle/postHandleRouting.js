const PostService = require ('../../service/postService');
const UserService = require('../../service/userService')
const fs = require("fs");
const qs =require('qs')
const cookie = require("cookie");
const formidable = require("formidable");
const path = require("path");
class PostHandleRouting {
    static getHome(posts, indexHtml) {
        let tbody = '';
        posts.map((post, index) => {
            tbody +=`
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
        indexHtml = indexHtml.replace('{post}',tbody)
        return indexHtml;
    }
    static showHome(req, res) {
        fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
            if (err) {
                console.log(err)
            } else {
                let posts = await PostService.findHome()
                homeHtml = PostHandleRouting.getHome(posts, homeHtml)
                res.writeHead(200, 'text/html');
                res.write(homeHtml);
                res.end();
            }
        })
    }
    static showCreatePosts(req, res) {
       if (req.method === 'GET') {
           fs.readFile('./views/user/createPosts.html', 'utf-8', (err, createHtml) => {
               if (err) {
                   console.log(err)
               } else {
                   res.writeHead(200, 'text/html');
                   res.write(createHtml);
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
                   const cookies = cookie.parse(req.headers.cookie || '');
                   let userCurrent = JSON.parse(cookies.user);
                   let idUser = userCurrent.id
                   let today = new Date();
                   let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
                   let time = today.getHours()+'-'+today.getMinutes();
                   let dateTime = time + '/' + date
                   let post = qs.parse(data);
                   let a = await PostService.createPost(post, dateTime, idUser)
                   res.writeHead(301, {'location': `/posts/formCreateImage/${a.insertId}`});
                   res.end();
               }
           })
       }
    }
    static showCreateImage(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/formCreateImage.html', 'utf-8', (err, createHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    createHtml = createHtml.replace('{id}', id)
                    res.writeHead(200, 'text/html');
                    res.write(createHtml);
                    res.end();
                }
            })
        } else {
            let form1 = new formidable.IncomingForm();
            form1.parse(req, async function (err, fields, files) {
                if (err) {
                    console.log(err)
                }
                let tmpPath = files.img.filepath;
                let newPath = path.join(__dirname, '..', '..', "public", files.img.originalFilename);
                await fs.readFile(newPath, (err) => {
                    if (err) {
                        fs.copyFile(tmpPath, newPath, (err) => {
                            if (err) throw err;
                        });
                    }
                })
                console.log(files.img.originalFilename)
                await PostService.createImagePost(files.img.originalFilename, id)
                res.writeHead(301, {'location': '/home'})
                res.end();
            });
        }
    }
    static deletePost(req, res, id) {
        if (req.method === 'POST') {
           let a = PostService.deletePost(id);
            res.writeHead(301, {'location': `/pageUser`});
            res.end();
        }
    }
    static createPostImage(req,res, id) {
        if (req.method === 'POST') {
            let form1 = new formidable.IncomingForm();
            form1.parse(req, async function (err, fields, files) {
                if (err) {
                    console.log(err)
                }
                let tmpPath2 = files.img.filepath;
                let newPath2 = path.join(__dirname, '..', '..', "public", files.img.originalFilename);
                await fs.readFile(newPath2, (err) => {
                    if (err) {
                        fs.copyFile(tmpPath2, newPath2, (err) => {
                            if (err) throw err;
                        });
                    }
                })
                await PostService.createImagePost(files.img.originalFilename, id)
                res.writeHead(301, {'location': '/createPosts'})
                res.end();
            });
        } else {
            fs.readFile('./views/user/formCreateImage.html', 'utf-8', async (err, createHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(createHtml);
                    res.end();
                }
            })
        }
    }
    static editPosts(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/editPosts.html', 'utf-8', async (err, editPosts) => {
                if (err) {
                    console.log(err)
                } else {
                    let posts = await PostService.finById(id)
                    editPosts = editPosts.replace('{content}', posts[0].content);
                    editPosts = editPosts.replace('{status}', posts[0].status);
                    res.writeHead(200, 'text/html');
                    res.write(editPosts);
                    res.end();
                }
            })
        } else {
            let post = '';
            req.on('data', chuck => {
                post += chuck;
            })
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let today = new Date();
                    let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
                    let time = today.getHours()+'-'+today.getMinutes();
                    let dateTime = time + '/' + date
                    let posts = qs.parse(post);
                    let b = await PostService.editPost(posts, id, dateTime)
                    console.log(b)
                    res.writeHead(301, {'location': `/posts/editImagePost/${b.insertId}`});
                    res.end();
                }
            })
        }
    }
    static editImagePost(req,res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/editImagePost.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            })
        }
    }

}
module.exports = PostHandleRouting;