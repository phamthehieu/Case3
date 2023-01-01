const PostService = require ('../../service/postService');
const UserService = require('../../service/userService')
const fs = require("fs");
const qs =require('qs')
const cookie = require("cookie");
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
                        <div class="col-sm-2" style="text-align: right; padding: 0;color: #1a1a1a">
                          <div class="dropdown">
                            <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: #1a1a1a"></a>
                               <ul class="dropdown-menu">
                                  <li><a class="dropdown-item" href="#">Chỉnh Sửa</a></li>
                                  <li><a class="dropdown-item" href="#">Xóa Bài Viết</a></li>
                               </ul>
                          </div>
                          </div>
                       <div class=" text-white" style="overflow-wrap: break-word;  text-align: left; padding: 0; margin-top: 5px">
                        <p>${post.content}</p>
                       </div>
                     </div>
                   </div>
                    <div><img src="/public/${post.imagePost}" alt="Khong Co" height="600px" width="auto""></div>
                </div>
              </div>
            </div>`
        })
        indexHtml = indexHtml.replace('{post}',tbody)
        return indexHtml;
    }
    static showHome(req, res) {
        const cookies = cookie.parse(req.headers.cookie || '');
        let userCurrent = JSON.parse(cookies.user);
        let id = userCurrent.id
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
                   let id = userCurrent.id
                   let today = new Date();
                   let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
                   let time = today.getHours()+'-'+today.getMinutes();
                   let dateTime = time + '/' + date
                   let post = qs.parse(data);
                   await PostService.createPost(post, dateTime, id)
                   res.writeHead(301, {'location': `/home`});
                   res.end();
               }
           })
       }
    }
}
module.exports = PostHandleRouting;