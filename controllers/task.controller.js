const TaskService = require('../services/task.service');

exports.handleForTask = async (req, res) => {
    try {
        const requirementId = req.params.requirementId;
        const sprintId = req.params.sprintId;
        const taskId = req.params.taskId;
        const deleteTaskId = req.params.deleteTaskId;
        //to test newTaskInfo pass from Post (json format)
        const newTaskInfo = req.body.newTaskInfo;
        const updateTaskInfo = req.body.updateTaskInfo;

        if (requirementId) {
            res.json(await TaskService.getTasksByRequirementId(req.params.requirementId));
        } else if (sprintId) {
            res.json(await TaskService.getTasksBySprintId(sprintId));
        } else if (newTaskInfo) {
            let result = await TaskService.createNewTask(newTaskInfo);
            if (result === null){
                res.json({ message: "createNewTask null result because of internal error"}); 
            }else {
                res.json({ message: "createNewTask Success" });
            }
        } else if (taskId) {
            let result = await TaskService.updateTaskInfo(updateTaskInfo, taskId);
            if (result === null){
                res.json({ message: "updateTaskInfo null result because of internal error"}); 
            }else{
                res.json({ message: "updateTaskInfo Success" });
            }
        } else if (deleteTaskId) {
            let result = await TaskService.deleteTaskInfo(deleteTaskId);
            if (result === null){
                res.json({ message: "deleteTaskInfo null result because of internal error"}); 
            }else{
                res.json({ message: "deleteTaskInfo Success" });
            }
        }
        else {
            res.json(await TaskService.getAllTasks());
        }
    } catch (e) {
        console.log(e);
        res.json({message: "Internal error"});
    }
}