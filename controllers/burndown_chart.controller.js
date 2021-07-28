const BurndownChartModel = require('../models/burndown_chart.model');
const BurndownChartService = require('../services/burndown_chart.service');
const DateUtil = require('../date_util');

exports.handleForBurndownChart = async (req, res) => {
    let isMergeWithReport = false;
    let userId = req.params.userId;
    let chartType =  BurndownChartModel.chartTypes.WEEKLY_CHART_FOR_PERSON;
    let fromDate = DateUtil.getPassWeekMondayDate();
    let toDate = DateUtil.getPassWeekFridayDate();

    let resultHtml = await BurndownChartService.loadChartData(isMergeWithReport, chartType, userId, fromDate, toDate);
    res.write(resultHtml);
    res.end();
}