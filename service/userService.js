const Connection = require('../model/connection');
Connection.connecting();

class UserService {
    login(user) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM user WHERE userName = '${user.username}' and password = '${user.password}';`,(err, users) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(users)
                }
            })
        })
    }
    signUp(user) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO user(userName, password,userEmail,birthday,age) VALUES ('${user.username}',${user.password},'${user.userEmail}','${user.birthday}',${user.age});`,(err, users) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(users)
                }
            })
        })
    }
    findById(id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM user WHERE id = ${id}`,(err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }
    editUser(user, id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE user SET userName = '${user.userName}', password = '${user.password}', userEmail = '${user.userEmail}', birthday = '${user.birthday}', age = ${user.age}, fullName = '${user.fullName}' WHERE id = ${id}`,(err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }
    editImage(image, id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE user SET userImage = '${image}' WHERE id = ${id}`,(err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
}
module.exports = new UserService();