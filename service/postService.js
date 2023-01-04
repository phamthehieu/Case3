const Connection = require('../model/connection');
Connection.connecting();

class PostService {
     findHome() {
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
            connection.query(`INSERT INTO post(content, createTime, idUser, imagePost, status) VALUES ('${post.content}', '${dateTime}',${id},'abc' ,'${post.status}')`,(err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    createImagePost(image, id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE post SET imagePost = '${image}' WHERE idPost = ${id}`,(err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    deletePost(id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM post WHERE idPost = ${id}`,(err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Thanh Cong')
                }
            })
        })
    }
    finById(id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM post WHERE idPost = ${id}`,(err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }
    editPost(post, id, dateTime) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE post SET content = '${post.content}', status = '${post.status}', createTime = '${dateTime}' WHERE idPost = ${id}`,(err, data) => {
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