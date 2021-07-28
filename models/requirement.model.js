const db = require('./db');

exports.statuses = {
    WAITING_FOR_CONFIRM: 1,
    CONFIRMED: 2
}

exports.getAllRequirements = async () => {
    try {
        let sql = `select iReq_ID, sTitle, sDescription, iEstimated_effort, dCreatedAt, dDueAt 
        from t_Requirement 
        order by iReq_id`;
        let rows = await db.query(sql);
        return rows ? rows : null;
    } catch (e) {
        console.log(e);
        return null;
    }
}

exports.createNewRequirement = async (newRequirementInfo) => {
    try {
        let sql = `INSERT INTO t_Requirement (sTitle, sDescription, iEstimated_effort, 
            dCreatedAt, dDueAt, iStatus)
        VALUES('${newRequirementInfo.title}', '${newRequirementInfo.description}', ${newRequirementInfo.estimatedHour},
            NOW(), '${newRequirementInfo.endAt}',${newRequirementInfo.status})`;
        await db.query(sql);
        sql = `select last_insert_id()`;
        let rows = await db.query(sql);
        return rows ? rows : null;
    } catch (e) {
        console.log(e)
        return null;
    }
}
