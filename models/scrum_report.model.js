const db = require('./db');

exports.reportFormats = {
    DAILY_REPORT_FOR_PM_OR_BA: 1,
    WEEKLY_REPORT_FOR_PM_OR_BA: 2,
    DAILY_REPORT_FOR_DEVELOPER: 3,
    WEEKLY_REPORT_FOR_DEVELOPER: 4,
    DAILY_REPORT_FOR_PERSON: 5,
    WEEKLY_REPORT_FOR_PERSON: 6
}

exports.fileFormats = {
    PDF: { ext: 'pdf', dbValue: 1 },
    EXCEL: { ext: 'xlsx', dbValue: 2 },
    HTML: { ext: 'html', dbValue: 3 }
};

exports.getReportData = async (fromDate, toDate, userId) => {
    try {
        let sql = `select t.sDescription as description, 
                          r.sTitle as title, 
                          u.user_name as userName,
                          u.role as role, 
                          t.iStatus as taskStatus, 
                          t.iEstimated_hour taskEstimatedHour,   
                          t.jHistorical_Spent as taskHistoricalSpent, 
                          t.iRemaining_hour as taskRemainingHour,
                          t.iTask_id as taskId,
                          t.sTitle as taskTitle, 
                          t.sDescription as taskDescription,
                          r.iReq_ID AS requirementId,
                          r.sTitle AS requirementTitle,
                          r.sDescription AS requirementDescription
                   from t_Task t INNER JOIN t_Requirement r  
                   on t.iReq_ID = r.iReq_ID   
                   inner join t_User u 
                   on t.iAssignee = u.id `;   
        if(fromDate == toDate){
            sql += `where '${fromDate}' between r.dCreatedAt and r.dDueAt `;
        }else{
            sql += `where r.dCreatedAt >= '${fromDate} 00:00:00' 
                    and r.dDueAt <= '${toDate} 23:59:59' `;
        }
        
        // by user id
        if (userId) {
            sql += `and u.id = ${userId}`;
        }
        console.log(sql);
        let rows = await db.query(sql);
        return rows ? rows : null;
    } catch (e) {
        console.log(e)
        return null;
    }
}