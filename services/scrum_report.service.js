const ScrumReportModel = require('../models/scrum_report.model');
const BurndownChartModel = require('../models/burndown_chart.model');
const TaskModel = require('../models/task.model');
const UserModel = require('../models/user.model');

const dateUtil = require('../date_util');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

exports.queryReport = async (reportFormat, userId) => {
    let fromDate = null;
    let toDate = null;
    if(reportFormat == ScrumReportModel.reportFormats.DAILY_REPORT_FOR_PERSON){
        fromDate = dateUtil.getCloselyWorkingDate();
        toDate = dateUtil.getCloselyWorkingDate();
    } else if(reportFormat == ScrumReportModel.reportFormats.WEEKLY_REPORT_FOR_PERSON){
        fromDate = dateUtil.getPassWeekMondayDate();
        toDate = dateUtil.getPassWeekFridayDate();
    }
    
    let userName = null;
    let role = null;
    let summaries = [];
    let tasks = [];
    let requirements = [];
    let requirementIdSet = new Set();
    let plans = [];
    let reportData = await ScrumReportModel.getReportData(fromDate, toDate, userId);
    if(reportData){
        reportData.map(row => {
            var taskSpentHour = 0;
            var jsons = JSON.parse(row.taskHistoricalSpent);
            if(jsons && jsons.hrs){
                jsons.hrs.map(hr =>{
                    taskSpentHour += hr;
                })
            }

            var taskStatusMeaning = TaskModel.getStatusesMeaning(row.taskStatus);
            var userRoleMeaning = UserModel.getRolesMeaning(row.role);

            if(userName == null){
                userName = row.userName;
            }

            if(role == null){
                role = userRoleMeaning;
            }

            summaries.push({
                taskDescription: row.description,
                requirementTitle: row.title,
                userName: row.userName,
                userRole: userRoleMeaning,
                taskStatus: taskStatusMeaning,
                taskEstimatedHour: row.taskEstimatedHour,
                taskTotalHistoricalHour: taskSpentHour,
                taskRemainingHour: row.taskRemainingHour
            });

            tasks.push({
                id: row.taskId,
                title: row.taskTitle,
                description: row.taskDescription
            });

            if(!requirementIdSet.has(row.requirementId)){
                requirements.push({
                    id: row.requirementId,
                    title: row.requirementTitle,
                    description: row.requirementDescription
                });

                if(reportFormat == ScrumReportModel.reportFormats.DAILY_REPORT_FOR_PERSON){
                    plans.push({
                        taskDescription: row.taskDescription,
                        requirementTitle: row.requirementTitle,
                        taskStatus: taskStatusMeaning,
                        taskEstimatedHour: row.taskEstimatedHour,
                        taskRemainingHour: row.taskRemainingHour
                    });
                }
                requirementIdSet.add(row.requirementId);
            }
            
        });
    }
    let resultReportRows = await loadReportData(reportFormat, summaries, tasks, requirements, plans, userName, role);
    return resultReportRows;

    function loadReportData(reportFormat, summaries, tasks, requirements, plans, userName, role) {
        return new Promise((resolve) => {
            let reportData;
            switch (reportFormat) {
                case ScrumReportModel.reportFormats.DAILY_REPORT_FOR_PERSON:
                    reportData = {
                        chartType: BurndownChartModel.chartTypes.DAILY_CHART_FOR_PERSON,
                        fromDate: fromDate,
                        toDate: toDate,
                        reportTitle: "Scrum Daily Report (Individual)",
                        reportDate: `${fromDate}`,
                        userName: userName,
                        userRole: role,
                        summary: summaries,
                        plan: plans,
                        task: tasks,
                        requirement: requirements
                    };
                    resolve(reportData);
                    break;
                case ScrumReportModel.reportFormats.WEEKLY_REPORT_FOR_PERSON:
                    reportData = {
                        chartType: BurndownChartModel.chartTypes.WEEKLY_CHART_FOR_PERSON,
                        fromDate: fromDate,
                        toDate: toDate,
                        reportTitle: "Scrum Weekly Report (Individual)",
                        reportDate: `From ${fromDate} To ${toDate}`,
                        userName: userName,
                        userRole: role,
                        summary: summaries,
                        task: tasks,
                        requirement: requirements
                    };
                    resolve(reportData);
                    break;
            }
        });
    }

    
}
exports.loadEjsMapping = (reportData, reportFormat, burndownChartOption) => {
    return new Promise((resolve) => {
        switch (reportFormat) {
            case ScrumReportModel.reportFormats.DAILY_REPORT_FOR_PM_OR_BA:
                resolve({
                    reportTitle: reportData.reportTitle,
                    reportDate: reportData.reportDate,
                    summaries: reportData.summary,
                    tasks: reportData.task,
                    requirements: reportData.requirement,
                    burndownChartOption: burndownChartOption
                });
                break;
            case ScrumReportModel.reportFormats.WEEKLY_REPORT_FOR_PM_OR_BA:
                resolve({
                    reportTitle: reportData.reportTitle,
                    reportDate: reportData.reportDate,
                    summaries: reportData.summary,
                    tasks: reportData.task,
                    requirements: reportData.requirement,
                    burndownChartOption: burndownChartOption
                });
                break;
            case ScrumReportModel.reportFormats.DAILY_REPORT_FOR_DEVELOPER:
                resolve({
                    reportTitle: reportData.reportTitle,
                    reportDate: reportData.reportDate,
                    summaries: reportData.summary,
                    tasks: reportData.task,
                    requirements: reportData.requirement,
                    burndownChartOption: burndownChartOption
                });
                break;
            case ScrumReportModel.reportFormats.WEEKLY_REPORT_FOR_DEVELOPER:
                resolve({
                    reportTitle: reportData.reportTitle,
                    reportDate: reportData.reportDate,
                    summaries: reportData.summary,
                    tasks: reportData.task,
                    requirements: reportData.requirement,
                    burndownChartOption: burndownChartOption
                });
                break;
            case ScrumReportModel.reportFormats.DAILY_REPORT_FOR_PERSON:
                resolve({
                    reportTitle: reportData.reportTitle,
                    reportDate: reportData.reportDate,
                    username: reportData.userName,
                    userrole: reportData.userRole,
                    summaries: reportData.summary,
                    plan: reportData.plan,
                    tasks: reportData.task,
                    requirements: reportData.requirement,
                    burndownChartOption: burndownChartOption
                });
                break;
            case ScrumReportModel.reportFormats.WEEKLY_REPORT_FOR_PERSON:
                resolve({
                    reportTitle: reportData.reportTitle,
                    reportDate: reportData.reportDate,
                    username: reportData.userName,
                    userrole: reportData.userRole,
                    summaries: reportData.summary,
                    tasks: reportData.task,
                    requirements: reportData.requirement,
                    burndownChartOption: burndownChartOption
                });
                break;
        }
    });
}

exports.renderHtmlStr = (ejsMapping, reportFormat, burndownChartHtml) => {
    return new Promise((resolve, reject) => {
        let ejsTemplate = loadEjsTemplate(reportFormat);
        ejs.renderFile(path.join(process.cwd(),
            'templates', ejsTemplate),
            ejsMapping,
            (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(html);
                }
            });

        function loadEjsTemplate(reportFormat) {
            switch (reportFormat) {
                // case ScrumReportModel.reportFormats.DAILY_REPORT_FOR_PM_OR_BA:
                //     return 'dailyreport_pm_or_ba.ejs';
                // case ScrumReportModel.reportFormats.WEEKLY_REPORT_FOR_PM_OR_BA:
                //     return 'weeklyreport_pm_or_ba.ejs';
                // case ScrumReportModel.reportFormats.DAILY_REPORT_FOR_DEVELOPER:
                //     return 'dailyreport_dev.ejs';
                // case ScrumReportModel.reportFormats.WEEKLY_REPORT_FOR_DEVELOPER:
                //     return 'weeklyreport_dev.ejs';
                case ScrumReportModel.reportFormats.DAILY_REPORT_FOR_PERSON:
                    return 'dailyreport_person.ejs';
                case ScrumReportModel.reportFormats.WEEKLY_REPORT_FOR_PERSON:
                    return 'weeklyreport_person.ejs';
            }
        }
    });
}

exports.saveHtmlFile = (html, filePath) => {
    return new Promise((resolve) => {
        let writeStream = fs.createWriteStream(filePath,
            { encoding: 'utf8', flags: 'w' })
            .on('error', function (err) {
                throw new Error(err);
            });
        writeStream.write(html);
        resolve();
    });
}
