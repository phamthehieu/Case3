const UserHandleRouting = require('./handle/userHandleRouting');
const PostHandleRouting = require('./handle/postHandleRouting')
const router = {
    'login' : UserHandleRouting.login,
    'user/signUp': UserHandleRouting.signUp,
    'home' : PostHandleRouting.showHome
}
module.exports = router;