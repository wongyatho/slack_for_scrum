const db = require('./db');
const RequirementModel = require('./requirement.model');

exports.statuses = {
    TO_DO: 1,
    IN_PROGRESS: 2,
    DONE: 3,
    NOT_ASSIGNED: 4
}

exports.getStatusesMeaning = (taskStatus) => {
    switch(taskStatus){
        case 1:
            return "To Do";
        case 2:
            return "In Progress";
        case 3:
            return "Done";
        case 4:
            return "Not Assigned";
        default:
            return "Unknown Task Status";
    }
}

hasRequirementIdConfirmed = async (requirementId) => {
    try {
        let sql = `SELECT count(1) as result_count
            FROM t_Requirement r
            WHERE r.iReq_id = ${requirementId} 
            AND r.iStatus IN (${RequirementModel.statuses.CONFIRMED})`;
        let rows = await db.query(sql);
        if (rows[0].result_count == 0) {
            return false;
        } else {
            return true;
        }
    } catch (e) {
        console.log(e)
        return false;
    }
}

exports.createNewTask = async (newTaskInfo) => {
    try {
        let requirementId = newTaskInfo.requirementId;
        if (!hasRequirementIdConfirmed(requirementId)) {
            return null;
        }

        let sql = `SELECT COUNT(1) as result_count
                FROM t_Task
                    WHERE iReq_id IN (${requirementId})`
        let rows = await db.query(sql);
        let nextTaskId = -1;
        if(rows[0].result_count == 0){
            nextTaskId = 1;
        }else{
            sql = `SELECT MAX(iTask_id) + 1 AS next_task_id 
                    FROM t_Task
                    WHERE iReq_id IN (${requirementId})`;
            rows = await db.query(sql);
            nextTaskId = rows[0].next_task_id;        
        }

        

        //insert into task table
        // Default Task Status to Not Assigned
        let default_status = 4;
        sql = `INSERT INTO t_Task (iReq_id, sTitle, sDescription, 
                        iEstimated_hour, iRemaining_hour, iStatus, 
                        iAssignee, dCreatedAt, dEndAt, dLastupdateAt)
                    VALUES (${requirementId}, '${newTaskInfo.title}', '${newTaskInfo.description}', ${newTaskInfo.estimatedHour}, 
                        ${newTaskInfo.remainingHour}, ${default_status}, ${newTaskInfo.assignee}, 
                        NOW(), '${newTaskInfo.endAt}', NOW())`;
        await db.query(sql);
        sql = `INSERT INTO t_sprint_task_rel (iSprintId, iTaskId) 
                VALUES (${newTaskInfo.sprintId}, ${nextTaskId})`;
        await db.query(sql);
    } catch (e) {
        console.log(e);
        return null;
    }
    
}

exports.getTasksByRequirementId = async (requirementId) => {
    try {
        let sql = `select *
            from t_Task 
            where iReq_id = ${requirementId}
            order by iTask_id`;
        let rows = await db.query(sql);
        return rows ? rows : null;
    } catch (e) {
        console.log(e);
        return null;
    }
}

exports.getTasksBySprintId = async (sprintId) => {
    try {
        let taskIds = [];
        let sql = `SELECT iTaskId
                    FROM t_sprint_task_rel 
                    WHERE iSprintId = ${sprintId}`;
        let rows = await db.query(sql);
        if (rows) {
            rows.forEach(row =>{
                taskIds.push(row.iTaskId);
            });
        } 
        return taskIds;
    } catch (e) {
        console.log(e)
        return 0;
    }
}

exports.getAllTasks = async () => {
    try {
        let sql = `SELECT * FROM t_Task`;
        return await db.query(sql)
    } catch (e) {
        console.log(e)
        return [];
    }
}

// update Task
exports.updateTaskInfo = async (updateTaskInfo, taskId) => {
    try {
        let comment_data = JSON.stringify(updateTaskInfo.comments_history);
        let time_data = JSON.stringify(updateTaskInfo.historical_spent);
    
        let sql = `UPDATE t_Task SET iReq_id = ${updateTaskInfo.Req_id},
                    sTitle = '${updateTaskInfo.Title}',
                    sDescription = '${updateTaskInfo.description}',
                    iEstimated_hour = ${updateTaskInfo.estimatedHour},
                    iRemaining_hour = ${updateTaskInfo.remainingHour},
                    jHistorical_Spent = '${time_data}',
                    iStatus = ${updateTaskInfo.status},
                    iAssignee= ${updateTaskInfo.assignee},
                    jComments_history = '${comment_data}',
                    dEndAt = '${updateTaskInfo.endAt}',
                    dLastUpdateAt = NOW()
                    where t_Task.iTask_id = ${taskId}`
        let rows = await db.query(sql);
        return rows ? rows : null
    } catch (e) {
        console.log(e)
        return null;
    }

}

//delete Task
exports.deleteTaskInfo = async(deleteTaskId) => {
    try {
        let sql = `DELETE FROM t_Task WHERE iTask_id = ${deleteTaskId}`
        let rows = await db.query(sql);
        return rows ? rows : null
    } catch (e){
        console.log(e)
        return null;
    }
}