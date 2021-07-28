const SprintService = require('../services/sprint.service');

exports.handleForSprint = async (req, res) => {
    const sprintId = req.params.sprintId;
    const newSprintInfo = req.body.newSprintInfo;
    const updateSprintInfo = req.body.updateSprintInfo;

    if (newSprintInfo) {
        let sprintId = await SprintService.createNewSprint(newSprintInfo);
        if(sprintId === null){
            res.json({ message: "createNewSprint null result because of internal error"});
        } else{
            res.json({sprintId: sprintId });
        }
    } else if (sprintId) {
        let taskIds = await SprintService.updateSprintInfo(updateSprintInfo, sprintId);
        if (taskIds){
            res.json({"taskIds":taskIds});
        }else {
            res.json({ message: "updateSprintInfo null result because of internal error"});
         }
    } else {
        res.json(await SprintService.getAllSprints());
    }
}