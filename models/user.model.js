const db = require('./db');

exports.getRolesMeaning = (roleNum) => {
    switch(roleNum){
        case 1:
            return "PM";
        case 2:
            return "BA";
        case 3:
            return "Programmer";
    }
}

exports.getById = async (userId) => {
    try {
        let sql = `select id, user_name, role, isProjectUser from t_User where id = ${userId}`;
        let row = await db.query(sql);
        return row ? row : null;
    } catch (e) {
        console.log(e)
        return null;
    }
}

exports.getByUserName = async (userName) => {
    try {
        let sql = `select id, user_name, role, isProjectUser from t_User where user_name = ${userName}`;
        let row = await db.query(sql);
        return row ? row : null;
    } catch (e) {
        console.log(e)
        return null
    }
}

exports.getByRole = async (role) => {
    try {
        let sql = `select id, user_name, role, isProjectUser from t_User where role = ${role} order by id`;
        let rows = await db.query(sql);
        return rows ? rows : null;
    } catch (e) {
        console.log(e)
        return null;
    }
}

exports.getAllUsers = async () => {
    try {
        let sql = `select id, user_name, role, isProjectUser 
        from t_User order 
        by id`;
        let rows = await db.query(sql);
        return rows ? rows : null;
    } catch (e) {
        console.log(e);
        return null;
    }
}

exports.updateUserInfo = async (updateUserInfo, userId) => {
    try { 
        let sql = `UPDATE t_User SET t_User.isProjectUser = ${updateUserInfo.isProjectUser} where t_User.id = ${userId}`;
        let rows = await db.query(sql);
        return rows ? rows : null;
    } catch (e) {
        console.log(e);
        return null;
    }
}