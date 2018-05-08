# coffeelint: disable=indentation,max_line_length

Ext.define( "q1plaza.view.analytics.Chart",
    extend: "Ext.chart.CartesianChart"
    requires: [
        'Ext.chart.series.Line'
        'Ext.chart.axis.Time'
        'Ext.chart.axis.Numeric'
        'Ext.chart.interactions.ItemHighlight'
    ]
    xtype: 'analytics-chart'

    store: {
        fields: [ "time" ]
        data: []
    }

    axes: [
        {
            type: 'numeric',
            position: 'left',
            # grid: true,
            minimum: 0,
            visibleRange: [0, 20]
            grid:
                stroke: '#eee'
        }
        {
            type: 'time',
            position: 'bottom'
        }
    ]

    series: []

    legend: { docked: "bottom" }

    config:
        params: null
        # metrics: null
        # from: null
        # to: null
        # resolution: null

    listeners:
        afterrender: 'initChart'
        scope: 'this'

    interactions: [
        {
            type: 'itemhighlight'
        }
    ]

    insetPadding: 50
    innerPadding: '10 10 1 1'

    initChart: (chart) ->
        # console.log "initcharts"

    updateParams: -> @refresh()

    refresh: ->
        me = this
        # metrics = @getMetrics()
        #
        # if not metrics or metrics.length == 0
        #     @removeSeries()
        #     console.log "no metrics, removing series"
        #     return

        Ext.Ajax.request({
            method: 'get'
            url: '/.analytics/get_series'
            params: @getParams()

            success: (response) ->
                res  = Ext.decode(response.responseText)
                data = []
                newSeries = []
                maxVisibleRange = 10

                res.forEach((metric) ->
                    newSeries.push metric.target
                    metric.datapoints.forEach((point, i) ->
                        data[i] ?= {}
                        data[i]['time'] ?= point[1] * 1000
                        data[i][metric.target] = point[0]
                        if point[0] > maxVisibleRange
                            maxVisibleRange = point[0]
                    )
                )

                seriesToRemove = []
                currentSeries = {}

                me.getSeries().forEach((s) ->
                    name = s.getTitle()
                    seriesToRemove.push(s) if name not in newSeries
                    currentSeries[name] = s
                )

                me.getAxis(0).setMaximum(Math.ceil(maxVisibleRange * 1.05))
                me.removeSeries(seriesToRemove)

                newSeries.forEach (name) ->
                    return if currentSeries[name]
                    # console.log 'adding series', name
                    me.addSeries(
                        type: 'line'
                        xField: 'time'
                        yField: name
                        title: name
                        marker:
                            radius: 2
                        smooth: 50
                        highlight:
                            radius: 4
                            fill: null
                            stroke: null
                        tooltip:
                            trackMouse: true
                            width: 140
                            height: 28
                            renderer: me.showItemInfo
                    )

                me.getStore().setData(data)
                me.fireEvent('updatedata')
        })

    showItemInfo: (record, item) ->
        series = item.series
        this.setHtml(Ext.String.format '{0}: {1}', series.getTitle(), record.get(series.getYField()))

)
