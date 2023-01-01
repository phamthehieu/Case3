const Connection = require('../model/connection');
Connection.connecting();

class PostService {
    findHome(id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM post p JOIN user U ON p.idUser = U.id;`,(err, product) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(product)
                }
            })
        })
    }
    showPage(id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM post p JOIN user U ON p.idUser = U.id WHERE id = ${id}`,(err, product) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(product)
                }
            })
        })
    }
    createPost(post, dateTime, id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO post(content, createTime, idUser, imagePost, status) VALUES ('${post.content}', '${dateTime}',${id} ,'${post.status}')`,(err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
}
module.exports  = new PostService();