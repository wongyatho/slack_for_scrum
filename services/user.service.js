const UserModel = require('../models/user.model');

exports.getAllUsers = async () => {
    return await UserModel.getAllUsers();
}

exports.updateUserInfo = async (updateUserInfo, userId) => {
    try {
        return await UserModel.updateUserInfo(updateUserInfo, userId);
    } catch (e){
        console.log(e)
    }
}