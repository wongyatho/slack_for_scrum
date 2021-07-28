const db = require('./db');

exports.chartTypes = {
    DAILY_CHART_FOR_PM_OR_BA: 1,
    WEEKLY_CHART_FOR_PM_OR_BA: 2,
    DAILY_CHART_FOR_DEVELOPER: 3,
    WEEKLY_CHART_FOR_DEVELOPER: 4,
    DAILY_CHART_FOR_PERSON: 5,
    WEEKLY_CHART_FOR_PERSON: 6
}

exports.getChartData = async (userId, fromDate, toDate) => {
    try {
        let sql = `SELECT a.iSprintId AS sprintID, 
                          a.Estimated_hour AS estimatedHour, 
                          t.jHistorical_Spent AS historicalSpent
                    FROM (
                        select str.iSprintId, t.iTask_id, SUM(s.Estimated_hour) AS Estimated_hour
                        from t_Sprint s
                        inner join t_sprint_task_rel str
                        on str.iSprintId = s.Sprint_ID
                        inner join t_Task t
                        on t.iTask_id = str.iTaskId
                        where t.iReq_id in (
                            select iReq_id from t_Requirement `;
            if(fromDate == toDate){
                //daily chart
                sql += `where '${fromDate}' between dCreatedAt and dDueAt `;
            }else{
                //weekly chart
                sql += `where dCreatedAt >= '${fromDate} 00:00:00'
                    and dDueAt <= '${toDate} 23:59:59' `;
            }
            sql += `) 
                group by str.iSprintId, t.iTask_id
            ) a, t_Task t
            WHERE a.iTask_id =  t.iTask_id`;
        if (userId) {
            sql += ` AND t.iAssignee = ${userId} `;
        }
        sql += `ORDER BY a.iSprintId`;
        let rows = await db.query(sql);
        return rows ? rows : null;
    } catch (e) {
        console.log(e);
        return null;
    }
}