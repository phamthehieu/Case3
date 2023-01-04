const fs = require('fs');
const qs = require('qs');
const UserService = require('../../service/userService');
const PostService = require ('../../service/postService');
const cookie = require('cookie');
const formidable = require('formidable');
const path = require("path");
const FriendShipService = require('../../service/friendshipService');

class FriendShipHandleRouting {
   static showAddFriend(friends, indexHtml) {
       let tbody = '';
       friends.map((friend2, index) => {
           tbody += `
            <div class="col-sm-12" style="margin-top: 30px">
              <div class="row align-items-start">
                <div class="col-sm-5 container text-center text-white">
                <div class="container text-center">
                    <div class="row align-items-start">
                        <div class="col" style="text-align: center; margin-top: 25px">
                           <img src="/public/${friend2.userImage}" alt="Khong Co"  class="rounded-circle" alt="Quantrimang.com" width="100" height="auto">
                            </div>
                        <div class="col" style="text-align: left;margin-top: 45px">
                           <h1>${friend2.fullName}</h1>  
                            </div>
                        <div class="col" style="text-align: right;margin-top: 50px">
                            <a href="/friend/confirm/${friend2.idUserReceive}"><button type="button" class="btn btn-outline-secondary text-white" >Chấp Nhận</button></a>
                            <a href="/friend/delete/${friend2.idUserReceive}"><button type="button" class="btn btn-outline-secondary text-white" >Xóa</button></a>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div> `
       })
       indexHtml = indexHtml.replace('{friend}', tbody)
       return indexHtml;
   }
   static showUser(friends1, indexHtml) {
       let tbody = '';
       friends1.map((friend1, index) => {
           tbody += `
            <div class="col-sm-12" style="margin-top: 30px">
              <div class="row align-items-start">
                <div class="col-sm-5 container text-center text-white">
                <div class="container text-center">
                    <div class="row align-items-start">
                        <div class="col" style="text-align: center; margin-top: 25px">
                           <img src="/public/${friend1.userImage}" alt="Khong Co"  class="rounded-circle" alt="Quantrimang.com" width="100" height="auto">
                            </div>
                        <div class="col" style="text-align: left;margin-top: 45px">
                           <h1>${friend1.fullName}</h1>  
                            </div>
                        <div class="col" style="text-align: right;margin-top: 50px">
                            <a href=""><button type="button" class="btn btn-outline-secondary text-white" >Kết Bạn</button></a>                       
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div> `
       })
       indexHtml = indexHtml.replace('{friend1}', tbody)
       return indexHtml;
   }
    static getFriends(friends2, indexHtml) {
        let tbody = '';
        friends2.map((friend, index) => {
            tbody += `
            <div class="col-sm-12" style="margin-top: 30px">
              <div class="row align-items-start">
                <div class="col-sm-5 container text-center text-white">
                <div class="container text-center">
                    <div class="row align-items-start">
                        <div class="col" style="text-align: center; margin-top: 25px">
                           <img src="/public/${friend.userImage}" alt="Khong Co"  class="rounded-circle" alt="Quantrimang.com" width="100" height="auto">
                            </div>
                        <div class="col" style="text-align: left;margin-top: 45px">
                           <h1>${friend.fullName}</h1>  
                            </div>
                        <div class="col" style="text-align: right;margin-top: 50px">                    
                            <a href="/friend/delete/${friend.idUserReceive}"><button type="button" class="btn btn-outline-secondary text-white" >Xóa</button></a>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div> `
        })
        indexHtml = indexHtml.replace('{friends}', tbody)
        return indexHtml;
    }
   showAddFriend(req, res) {
       fs.readFile('views/user/addFriends.html', 'utf-8', async (err, addFriendHtml) => {
           if (err) {
               console.log(err)
           } else {
               let friend1 = await FriendShipService.finAllUser()
               let friend = await FriendShipService.finAll()
               addFriendHtml = FriendShipHandleRouting.showUser(friend1, addFriendHtml)
               addFriendHtml = FriendShipHandleRouting.showAddFriend(friend, addFriendHtml)
               res.writeHead(200, 'text/html');
               res.write(addFriendHtml);
               res.end();
           }
       })
   }
   showFriends(req, res) {
       fs.readFile('views/user/friends.html', 'utf-8', async (err, friendHtml) => {
           if (err) {
               console.log(err)
           } else {
               let friend2 = await FriendShipService.finAllFriends()
               friendHtml = FriendShipHandleRouting.getFriends(friend2, friendHtml)
               res.writeHead(200, 'text/html');
               res.write(friendHtml);
               res.end();
           }
       })
   }
    acceptFriends(req,res, id) {
        fs.readFile('views/user/addFriends.html', 'utf-8', async (err, addHtml) => {
            if (err) {
                console.log(err)
            } else {
                await FriendShipService.addFriends(id)
                res.writeHead(301,{'location': `/friend/listFriends`});
                res.write(addHtml)
                res.end();
            }
        })
    }
    deleteFriends(req,res, id) {
        fs.readFile('views/user/friends.html', 'utf-8', async (err, addHtml) => {
            if (err) {
                console.log(err)
            } else {
                 await FriendShipService.deleteFriend(id)
                res.writeHead(301,{'location': `/friend/listFriends`});
                res.end();
            }
        })
    }
}

module.exports = new FriendShipHandleRouting();