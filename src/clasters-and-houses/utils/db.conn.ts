const mysql = require('mysql2/promise')

// let pool: mysql.Connection;
// export async function dbconn() {
//     if(pool) return pool;
    export const pool = mysql.createPool({
        host: '10.2.1.85',
        port: 3306,
        user: 'qruser',
        database: 'UTM5',
        password: 'tp3XfG9kR',
        connectionLimit: 10
    })

    export const tvpool = mysql.createPool({
        host: '10.2.1.65',
        port: 3306,
        user: 'qruser',
        database: 'UTM5TV',
        password: '1qa0ok2ws',
        connectionLimit: 10
    })
//     return pool;
// }

// dbconn();