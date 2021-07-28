exports.getHtmlHeader = () => {
    return `<!DOCTYPE html>
                <head>
                <style type="text/css">
                    body {
                        width: 1200px;
                        margin: 0;
                        padding: 0px;
                        font-size: 16px;
                        line-height: 24px;
                        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                        color: rgb(33, 33, 33);
                    }
                
                    .report-header {
                        background: rgb(55, 39, 114);
                        color: rgb(255, 255, 255);
                        padding: 15px;
                        padding-left: 200px;
                        box-sizing: border-box;
                        display: block;
                        position: relative;
                    }
                
                    .report-header .logo {
                        position: absolute;
                        top: 40px;
                        left: 15px;
                        width: 150px;
                    }
                
                    .report-body {
                        width: 70%;
                        display: inline-block;
                        position: relative;
                        padding: 15px;
                        box-sizing: border-box;
                        vertical-align: top;
                    }
                </style>
                <meta charset="utf-8">
                </head>`;
};

exports.loadHtmlReportHeader = (chartTitle, chartGenerateDay) => {
    return `<body>
    <div class="report-header">
        <h1>${chartTitle}</h1>
        <p>${chartGenerateDay}</p>
    </div>`;
};

exports.loadHtmlFooter = (srcOption) => {
    return `
    <div id="echart_main" class="report-body" style="width: 600px;height:400px;"></div>
	
	<script src="/echarts.min.js"></script>
	<script type="text/javascript">
    var myChart = echarts.init(document.getElementById('echart_main'));
    myChart.setOption(${srcOption});
    </script>
    </body>
    </html>`;
}
