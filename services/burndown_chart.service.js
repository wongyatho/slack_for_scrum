const BurndownChartModel = require('../models/burndown_chart.model');
const htmlUtil = require('../html_util');
const dateUtil = require('../date_util');

exports.loadChartData = async (isMergeWithReport, chartType, userId, fromDate, toDate) => {
    try {
        if(!chartType){
            return new Error('Please input chartType!');
        }
        
        let srcOption = await loadEchartOptionBy(chartType, userId, fromDate, toDate);
        if(isMergeWithReport){
            return srcOption;
        }else{
            let html = [];
            html.push(htmlUtil.getHtmlHeader());
            html.push(htmlUtil.loadHtmlReportHeader(`Burndown Chart (${fromDate} - ${toDate})`, dateUtil.getTodayDate()));
            html.push(htmlUtil.loadHtmlFooter(JSON.stringify(srcOption)));
            return html.join();
        }

        async function loadEchartOptionBy(chartType, userId, fromDate, toDate) {
            let resultChartRows = await BurndownChartModel.getChartData(userId, fromDate, toDate);
            let sprints = [];
            let plannedHours = [];
            let actualHours = [];

            if (resultChartRows) {
                resultChartRows.map(row => {
                    sprints.push('sprint ' + row.sprintID);
                    plannedHours.push(row.estimatedHour);
                    if(row.historicalSpent){
                        var hour = 0;
                        var jsons = JSON.parse(row.historicalSpent);
                        if(jsons && jsons.hrs){
                            jsons.hrs.map(hr =>{
                                hour += hr;
                            })
                        }
                        actualHours.push(hour);
                    }else{
                        actualHours.push(0);
                    }
                });
            }

            let chartData = {
                title: {
                    text: 'Burndown Chart',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['Planned Hours', 'Actual Hours']
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: sprints
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} hrs'
                    }
                },
                series: [
                    {
                        name: 'Planned Hours',
                        type: 'line',
                        data: plannedHours
                    },
                    {
                        name: 'Actual Hours',
                        type: 'line',
                        data: actualHours
                    }
                ]
            };
            
            switch (chartType) {
                case BurndownChartModel.chartTypes.DAILY_CHART_FOR_PERSON:
                    chartData.title.subtext = `Daily Report (${toDate})`;
                    break;
                case BurndownChartModel.chartTypes.WEEKLY_CHART_FOR_PERSON:
                    chartData.title.subtext = `Weekly Report (${fromDate} To ${toDate})`;
                    break;
            }
            return chartData;
        }
    } catch (e) {
        console.log(e)
        return null;
    }

}