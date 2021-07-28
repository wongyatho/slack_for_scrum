const db = require('./db');

exports.getAllSprints = async () => {
    let sql = `SELECT * FROM t_Sprint`;
    return await db.query(sql);
}

exports.createNewSprint = async (newSprintInfo) => {
    try {
        if (newSprintInfo.taskIds) {
            for(i=0; i< newSprintInfo.taskIds.length; i++) {
                var taskId = newSprintInfo.taskIds[i];
                let sql = `SELECT COUNT(1) AS result_count
                FROM t_sprint_task_rel
                WHERE iTaskid = ${taskId}`;
                let rows = await db.query(sql);

                sql = `INSERT INTO t_Sprint (Estimated_hour,
                    Create_at, End_at, Last_update_at)
                        VALUES(0, '${newSprintInfo.created_at}','${newSprintInfo.endAt}',NOW())`;
                await db.query(sql);

                rows = await db.query(`SELECT MAX(Sprint_ID) AS Sprint_ID FROM t_Sprint`);
                await db.query(`INSERT INTO t_sprint_task_rel (iSprintId, iTaskId) VALUES (${rows[0].Sprint_ID}, ${taskId})`);

                await db.query(`UPDATE t_Sprint
                SET Estimated_hour = (
                    SELECT SUM(t.iEstimated_hour)
                    FROM t_Task t
                    WHERE t.iTask_id IN (
                        SELECT iTaskId
                        FROM t_sprint_task_rel
                        WHERE iSprintId IN (${rows[0].Sprint_ID})
                    )
                )
                WHERE Sprint_ID = ${rows[0].Sprint_ID}`);
            }
            return rows[0].Sprint_ID;
        } else {
            let sql = `INSERT INTO t_Sprint (Estimated_hour,
                Create_at, End_at, Last_update_at)
                    VALUES(0, '${newSprintInfo.created_at}','${newSprintInfo.endAt}',NOW())`;
            await db.query(sql);
            sql = `SELECT MAX(Sprint_ID) AS Sprint_ID FROM t_Sprint`;
            let rows = await db.query(sql);
            return rows[0].Sprint_ID;
        }
    } catch (e) {
        console.log(e)
        return null;
    }
}

exports.updateSprintInfo = async (updateSprintInfo, sprintId) => {
    try {
        let sql = `INSERT INTO t_sprint_task_rel VALUES(${sprintId}, ${updateSprintInfo.taskId})`;
        await db.query(sql);
        let rows = await db.query(`SELECT iTaskId as taskId FROM t_sprint_task_rel where iSprintId = ${sprintId}`);
        return rows ? rows : null
    } catch (e) {
        console.log(e)
        return null;
    }
}
