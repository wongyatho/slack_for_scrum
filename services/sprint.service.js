const SprintModel = require('../models/sprint.model');

exports.getAllSprints = async () => {
    return await SprintModel.getAllSprints();
}

exports.createNewSprint = async (newSprintInfo) => {
    try {
        return await SprintModel.createNewSprint(newSprintInfo)
    } catch (e) {
        console.log(e)
    }
}

exports.updateSprintInfo = async (updateSprintInfo, sprintId) => {
    try{
        let taskIds = [];
        let result = await SprintModel.updateSprintInfo(updateSprintInfo, sprintId);
        if(result){
           for(var i=0; i< result.length; i++){
                taskIds.push(result[i].taskId);
           }
           return taskIds;
        }else{
            return [];
        }
    } catch (e) {
        console.log(e);
        return null;
    }
    
}