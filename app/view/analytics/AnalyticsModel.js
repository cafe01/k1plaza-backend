/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext */

Ext.define('q1plaza.view.analytics.AnalyticsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.analytics-analytics',
    data: {
        enabledMetrics: ['pageview', 'desktop'],
        rangeFrom: '-30d',
        rangeTo: 'now',
        resolution: '1d'
    },

    formulas: {
        queryParams: {
            bind: {
                target: '{enabledMetrics}',
                from: '{rangeFrom}',
                to: '{rangeTo}',
                resolution: '{resolution}'
            },
            get: function(data) {
                var params = Ext.apply({}, data),
                    months = [
                        "january", "february", "march", "april", "may", "june", "july",
                        "august", "september", "october", "november", "december"
                    ];

                params.target = data.target.join(',');


                if (params.from === 'thismonth') {
                    params.from = months[(new Date()).getMonth()] + '+1';
                }

                if (params.from === 'thisyear') {
                    params.from = 'january+1';
                }

                return params;
            }
        }
    }

});
