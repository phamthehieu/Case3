const UserHandleRouting = require('./handle/userHandleRouting');
const PostHandleRouting = require('./handle/postHandleRouting')
const router = {
    'login' : UserHandleRouting.login,
    'user/signUp': UserHandleRouting.signUp,
    'home' : PostHandleRouting.showHome,
    'pageUser' : UserHandleRouting.showPage,
    'user/editInfo' : UserHandleRouting.editUser,
    'formEditImage' : UserHandleRouting.editImage,
    'createPosts' : PostHandleRouting.showCreatePosts,
    'posts/formCreateImage' : PostHandleRouting.showCreateImage,
    'posts/delete' : PostHandleRouting.deletePost,
    'posts/editPosts' : PostHandleRouting.editPosts,
    'posts/editImagePosts' : PostHandleRouting.editImagePost
}
module.exports = router;