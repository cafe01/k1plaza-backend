# coffeelint: disable=indentation,max_line_length

Ext.define( "q1plaza.view.analytics.PieChart",
    extend: "Ext.chart.PolarChart"
    requires: [
        'Ext.chart.series.Pie'
        'Ext.chart.interactions.ItemHighlight'
        'Ext.chart.interactions.Rotate'
    ]

    xtype: 'analytics-piechart'

    store: {
        fields: [ "name", "value" ]
        data: []
    }

    series: [{
        type: 'pie'
        angleField: 'value'
        label:
            field: 'name'
            calloutLine:
                width: 2
        highlight: true
        tooltip:
            trackMouse: true
            renderer: (rec) ->
                @setHtml(rec.get('name') + ': ' + rec.get('value') + '%')
    }]

    # legend: { docked: "bottom" }

    config:
        params: null
        sourceChart: null
        metric: null

    interactions: ['itemhighlight', 'rotate']

    insetPadding: 20
    innerPadding: 20

    # initChart: (chart) -> console.log "piechart", @getSourceChart()

    updateSourceChart: (chart) -> chart.on('updatedata', @updateFromSourceChart, @)

    updateParams: (params) ->
        params = Ext.apply({}, params)
        params.target = @getMetric()

        Ext.Ajax.request({
            method: 'get'
            url: '/.analytics/get_series'
            params: params
            scope: @
            success: (response) ->
                res = Ext.decode(response.responseText)
                data = []
                res.forEach((metric) ->
                    total = metric.datapoints.map((p) -> p[0]).reduce((sum, item) -> item += sum)
                    data.push({
                        name: metric.target
                        value: total
                    })
                )

                @getStore().setData(data)
        })

    updateFromSourceChart: ->
        chart = @getSourceChart()
        data = []
        sourceData = chart.getStore().getRange()

        Ext.Object.eachValue(chart.series.map, (s) ->
            name  = s.getYField()
            total = sourceData.map((r) -> r.get(name)).reduce((sum, item) -> item += sum)
            data.push({
                name: name
                value: total
            })
        )
        @getStore().setData(data)
)
