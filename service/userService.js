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
}
module.exports = new UserService()