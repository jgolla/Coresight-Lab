(function (CS) {
    'use strict';

    var def = {
        typeName: 'timeserieschart',
        model: CS.MultiSourceSymbol,
        datasourceBehavior: CS.DatasourceBehaviors.Multiple,
        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.DataQueryMode.ModePlotValues,
                Interval: 400,
                Height: 200,
                Width: 400
            };
        },        
        init: init
    };

    function init(scope, elem) {
        var container = elem.find('#container')[0];
        var id = "timeseries_" + Math.random().toString(36).substr(2, 16);
        container.id = id;

        function convertToChartData(data) {
            var series = [];
            data.Data.forEach(function(item) {
                var t = {};
                t.name = item.Label;
                t.data = item.Values.map(function(obj) {
                    var date = new Date(0);
                    date.setUTCSeconds(obj.Time);
                    return [Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()), Number(obj.Value)];
                });
                series.push(t);
            });

            return series;
        }

        var chart;
        function dataUpdate(data) {
            if(data) {

                var series = convertToChartData(data);
                if(!chart) {
                    chart = new Highcharts.Chart({
                        chart: {
                            type: 'spline',
                            renderTo: id
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: { // don't display the dummy year
                                month: '%e. %b',
                                year: '%b'
                            },
                            title: {
                                text: 'Date'
                            }
                        },
                        plotOptions: {
                            spline: {
                                marker: {
                                    enabled: true
                                }
                            }
                        },
                        series: series
                    });
                } else {
                    series.forEach(function(item, index) {
                        if(chart.series[index]) {
                            chart.series[index].setData(item.data);
                        } else {
                            chart.addSeries(item);
                        }
                    });                    
                }

            }
        }

        function resize(width, height) {
            if(chart) {
                chart.setSize(width, height);
            }
        }

        return { dataUpdate: dataUpdate, resize: resize };
    }    

    CS.symbolCatalog.register(def);

}(window.Coresight));