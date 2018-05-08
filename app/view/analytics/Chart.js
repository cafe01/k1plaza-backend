(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Ext.define("q1plaza.view.analytics.Chart", {
    extend: "Ext.chart.CartesianChart",
    requires: ['Ext.chart.series.Line', 'Ext.chart.axis.Time', 'Ext.chart.axis.Numeric', 'Ext.chart.interactions.ItemHighlight'],
    xtype: 'analytics-chart',
    store: {
      fields: ["time"],
      data: []
    },
    axes: [
      {
        type: 'numeric',
        position: 'left',
        minimum: 0,
        visibleRange: [0, 20],
        grid: {
          stroke: '#eee'
        }
      }, {
        type: 'time',
        position: 'bottom'
      }
    ],
    series: [],
    legend: {
      docked: "bottom"
    },
    config: {
      params: null
    },
    listeners: {
      afterrender: 'initChart',
      scope: 'this'
    },
    interactions: [
      {
        type: 'itemhighlight'
      }
    ],
    insetPadding: 50,
    innerPadding: '10 10 1 1',
    initChart: function(chart) {},
    updateParams: function() {
      return this.refresh();
    },
    refresh: function() {
      var me;
      me = this;
      return Ext.Ajax.request({
        method: 'get',
        url: '/.analytics/get_series',
        params: this.getParams(),
        success: function(response) {
          var currentSeries, data, maxVisibleRange, newSeries, res, seriesToRemove;
          res = Ext.decode(response.responseText);
          data = [];
          newSeries = [];
          maxVisibleRange = 10;
          res.forEach(function(metric) {
            newSeries.push(metric.target);
            return metric.datapoints.forEach(function(point, i) {
              var _base;
              if (data[i] == null) {
                data[i] = {};
              }
              if ((_base = data[i])['time'] == null) {
                _base['time'] = point[1] * 1000;
              }
              data[i][metric.target] = point[0];
              if (point[0] > maxVisibleRange) {
                return maxVisibleRange = point[0];
              }
            });
          });
          seriesToRemove = [];
          currentSeries = {};
          me.getSeries().forEach(function(s) {
            var name;
            name = s.getTitle();
            if (__indexOf.call(newSeries, name) < 0) {
              seriesToRemove.push(s);
            }
            return currentSeries[name] = s;
          });
          me.getAxis(0).setMaximum(Math.ceil(maxVisibleRange * 1.05));
          me.removeSeries(seriesToRemove);
          newSeries.forEach(function(name) {
            if (currentSeries[name]) {
              return;
            }
            return me.addSeries({
              type: 'line',
              xField: 'time',
              yField: name,
              title: name,
              marker: {
                radius: 2
              },
              smooth: 50,
              highlight: {
                radius: 4,
                fill: null,
                stroke: null
              },
              tooltip: {
                trackMouse: true,
                width: 140,
                height: 28,
                renderer: me.showItemInfo
              }
            });
          });
          me.getStore().setData(data);
          return me.fireEvent('updatedata');
        }
      });
    },
    showItemInfo: function(record, item) {
      var series;
      series = item.series;
      return this.setHtml(Ext.String.format('{0}: {1}', series.getTitle(), record.get(series.getYField())));
    }
  });

}).call(this);
