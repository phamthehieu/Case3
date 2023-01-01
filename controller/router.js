const UserHandleRouting = require('./handle/userHandleRouting');
const PostHandleRouting = require('./handle/postHandleRouting')
const router = {
    'login' : UserHandleRouting.login,
    'user/signUp': UserHandleRouting.signUp,
    'home' : PostHandleRouting.showHome,
    'pageUser' : UserHandleRouting.showUserPage,
    'user/editInfo' : UserHandleRouting.editUser,
    'formEditImage' : UserHandleRouting.editImage,
    'createPosts' : PostHandleRouting.showCreatePosts
}
module.exports = router;