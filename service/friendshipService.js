const Connection = require('../model/connection');
Connection.connecting();

class FriendshipService {
    finAll() {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM user u JOIN friendship f ON u.id = f.idUserReceive  WHERE status = 'confirm'`,(err, friend) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(friend)
                }
            })
        })
    }
    finAllUser() {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM user u JOIN friendship f ON u.id = f.idUserReceive  WHERE status = 'stranger'`,(err, friend) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(friend)
                }
            })
        })
    }
    finAllFriends() {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM user u JOIN friendship f ON u.id = f.idUserReceive  WHERE status = 'friend'`,(err, friend) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(friend)
                }
            })
        })
    }

    addFriends(id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE friendship SET status = 'friend' WHERE idUserReceive = ${id}`,(err, friend) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(friend)
                }
            })
        })
    }
    checkStatus(id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT status FROM friendship WHERE idUserReceive = ${id}`,(err, friend) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(friend)
                }
            })
        })
    }
    deleteFriend(id) {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE friendship SET status = 'confirm' WHERE idUserReceive = ${id}`,(err, friend) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(friend)
                }
            })
        })
    }
}
module.exports = new FriendshipService();