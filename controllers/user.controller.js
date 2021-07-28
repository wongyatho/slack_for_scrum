const UserService = require('../services/user.service');

exports.handleForUsers = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updateUserInfo = req.body.updateUserInfo;

        if (userId) {
            let result = await UserService.updateUserInfo(updateUserInfo, userId);
            if (result === null){
                res.json({ message: "updateUserInfo null result because of internal error"}); 
            }else {
                res.json({ message: "updateUserInfo Success" });
            }
        } else {
            res.json(await UserService.getAllUsers());
        }
    } catch (e) {
        console.log(e);
        res.json({message: "Internal Error"});
    }
}