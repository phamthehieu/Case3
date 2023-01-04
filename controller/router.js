const UserHandleRouting = require('./handle/userHandleRouting');
const PostHandleRouting = require('./handle/postHandleRouting');
const FriendShipHandleRouting = require('./handle/friendShipHandleRouting')
const router = {
    'user/login' : UserHandleRouting.login,
    'user/signUp': UserHandleRouting.signUp,
    'user/home' : PostHandleRouting.showHome,
    'user/pageUser' : UserHandleRouting.checkIdFormUser,
    'user/editInfo' : UserHandleRouting.editUser,
    'user/formEditImage' : UserHandleRouting.editImage,
    'user/createPosts' : PostHandleRouting.showCreatePosts,
    'posts/formCreateImage' : PostHandleRouting.showCreateImage,
    'posts/delete' : PostHandleRouting.deletePost,
    'posts/editPosts' : PostHandleRouting.editPosts,
    'posts/editImagePost' : PostHandleRouting.editImagePost,
    'friend/addFriend' : FriendShipHandleRouting.showAddFriend,
    'friend/listFriends' : FriendShipHandleRouting.showFriends,
    'friend/confirm' : FriendShipHandleRouting.acceptFriends,
    'friend/delete' : FriendShipHandleRouting.deleteFriends
}
module.exports = router;