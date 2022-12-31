const mysql = require('mysql');

class Connection {
    static configMySQL = {
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'casemd3',
        charset: 'utf8_general_ci'
    }
    static getConnection() {
        return mysql.createConnection(Connection.configMySQL)
    }
    static connecting() {
        Connection.getConnection().connect(error => {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Connect Success !!!')
            }
        })
    }
}
module.exports = Connection;