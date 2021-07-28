const TaskModel = require('../models/task.model');

exports.getTasksByRequirementId = async (requirementId) => {
    return await TaskModel.getTasksByRequirementId(requirementId);
}

exports.getTasksBySprintId = async (sprintId) => {
    return await TaskModel.getTasksBySprintId(sprintId);
}

exports.getAllTasks = async () => {
    return await TaskModel.getAllTasks();
}

exports.createNewTask = async (newTaskInfo) => {
    try {
        return await TaskModel.createNewTask(newTaskInfo);
    } catch (e) {
        console.log(e)
    }
}

exports.updateTaskInfo = async (updateTaskInfo, taskId) => {
    try {
        return await TaskModel.updateTaskInfo(updateTaskInfo, taskId);
    } catch (e) {
        console.log(e)
    }
}

exports.deleteTaskInfo = async (deleteTaskId) => {
    try {
        return await TaskModel.deleteTaskInfo(deleteTaskId);
    } catch (e) {
        console.log(e)
    }
}