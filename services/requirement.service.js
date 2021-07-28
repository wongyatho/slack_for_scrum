const RequirementModel = require('../models/requirement.model');

exports.getAllRequirements = async () => {
    return await RequirementModel.getAllRequirements();
}

exports.createNewRequirement = async (newRequirementInfo) =>{
    try {
        return await RequirementModel.createNewRequirement(newRequirementInfo);
    }catch (e) {
        console.log(e)
    }
}