const UserHandleRouting = require('./handle/userHandleRouting');
const PostHandleRouting = require('./handle/postHandleRouting')
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
    'posts/editImagePost' : PostHandleRouting.editImagePost
}
module.exports = router;