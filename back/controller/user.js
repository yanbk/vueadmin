const mysql = require('../db/index')
const sql = require('../db/sql')

const getUsers = async function(ctx) {
    let data = await mysql.query(sql.queryUsers)

    ctx.body = {
        code: 0,
        data: data
    }
}

module.exports = {
    getUsers
}