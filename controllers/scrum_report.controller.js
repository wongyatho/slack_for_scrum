const ScrumReportModel = require('../models/scrum_report.model');
const ScrumReportService = require('../services/scrum_report.service');
const BurndownChartService = require('../services/burndown_chart.service');

exports.handleForScrumReport = async (req, res) => {
    try {
        const userId = req.params.userId;
        const fileFormat = ScrumReportModel.fileFormats.HTML;
        let reportFormat = ScrumReportModel.reportFormats.DAILY_REPORT_FOR_PERSON;
        if(req.query.weekly == 1){
            reportFormat = ScrumReportModel.reportFormats.WEEKLY_REPORT_FOR_PERSON;
        }

        let reportData = await ScrumReportService.queryReport(reportFormat, userId);
        let burndownChartOption = await BurndownChartService.loadChartData(true, reportData.chartType, userId, reportData.fromDate, reportData.toDate);
        let ejsMapping = await ScrumReportService.loadEjsMapping(reportData, reportFormat, burndownChartOption);
        switch (fileFormat) {
            case ScrumReportModel.fileFormats.HTML:
                let html = await ScrumReportService.renderHtmlStr(ejsMapping, reportFormat);
                res.write(html);
                res.end();
                break;
            default:
                res.send("There is no result!");
                break;
        }
    } catch (e) {
        console.log(e)
        res.send(`Error in generating the report`);
    }
}