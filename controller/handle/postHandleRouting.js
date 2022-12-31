const PostService = require ('../../service/postService');
const fs = require("fs");
class PostHandleRouting {
    showHome(req, res) {
        fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
            if (err) {
                console.log(err)
            } else {
                res.writeHead(200, 'text/html');
                res.write(homeHtml);
                res.end();
            }
        })
    }
}
module.exports = new PostHandleRouting();