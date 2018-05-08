(function() {
  Ext.define("q1plaza.view.analytics.PieChart", {
    extend: "Ext.chart.PolarChart",
    requires: ['Ext.chart.series.Pie', 'Ext.chart.interactions.ItemHighlight', 'Ext.chart.interactions.Rotate'],
    xtype: 'analytics-piechart',
    store: {
      fields: ["name", "value"],
      data: []
    },
    series: [
      {
        type: 'pie',
        angleField: 'value',
        label: {
          field: 'name',
          calloutLine: {
            width: 2
          }
        },
        highlight: true,
        tooltip: {
          trackMouse: true,
          renderer: function(rec) {
            return this.setHtml(rec.get('name') + ': ' + rec.get('value') + '%');
          }
        }
      }
    ],
    config: {
      params: null,
      sourceChart: null,
      metric: null
    },
    interactions: ['itemhighlight', 'rotate'],
    insetPadding: 20,
    innerPadding: 20,
    updateSourceChart: function(chart) {
      return chart.on('updatedata', this.updateFromSourceChart, this);
    },
    updateParams: function(params) {
      params = Ext.apply({}, params);
      params.target = this.getMetric();
      return Ext.Ajax.request({
        method: 'get',
        url: '/.analytics/get_series',
        params: params,
        scope: this,
        success: function(response) {
          var data, res;
          res = Ext.decode(response.responseText);
          data = [];
          res.forEach(function(metric) {
            var total;
            total = metric.datapoints.map(function(p) {
              return p[0];
            }).reduce(function(sum, item) {
              return item += sum;
            });
            return data.push({
              name: metric.target,
              value: total
            });
          });
          return this.getStore().setData(data);
        }
      });
    },
    updateFromSourceChart: function() {
      var chart, data, sourceData;
      chart = this.getSourceChart();
      data = [];
      sourceData = chart.getStore().getRange();
      Ext.Object.eachValue(chart.series.map, function(s) {
        var name, total;
        name = s.getYField();
        total = sourceData.map(function(r) {
          return r.get(name);
        }).reduce(function(sum, item) {
          return item += sum;
        });
        return data.push({
          name: name,
          value: total
        });
      });
      return this.getStore().setData(data);
    }
  });

}).call(this);
