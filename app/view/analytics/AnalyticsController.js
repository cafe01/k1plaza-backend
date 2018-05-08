(function() {
  Ext.define('q1plaza.view.analytics.AnalyticsController', {
    extend: 'q1plaza.base.ViewController',
    alias: 'controller.analytics-analytics',
    init: function() {
      var view;
      view = this.getView();
      this.vmSet('mainChart', this.lookupReference('mainChart'));
      this.initMetricsMenu();
      this.initTimeRangeMenu();
      return this.initResolution();
    },
    initResolution: function() {
      var resolution;
      resolution = this.getVM().get('resolution');
      return this.lookupReference('resolutionPicker').items.findBy(function(item) {
        return item.value === resolution;
      }).setPressed(true);
    },
    initTimeRangeMenu: function() {
      var btnTimeRange, checkedItem, rangeFrom, rangeTo, vm;
      vm = this.getVM();
      rangeFrom = vm.get('rangeFrom');
      rangeTo = vm.get('rangeTo');
      btnTimeRange = this.lookupReference('btnTimeRange');
      checkedItem = btnTimeRange.menu.items.findBy(function(item) {
        return item.to === rangeTo && item.from === rangeFrom;
      });
      if (checkedItem) {
        checkedItem.setChecked(true);
        return vm.set('timePickerText', checkedItem.text);
      }
    },
    initMetricsMenu: function() {
      var availableMetrics, btnMetrics, btnText, enabledMetrics, menuItems, vm;
      vm = this.getVM();
      availableMetrics = vm.get('config.availableMetrics');
      enabledMetrics = vm.get('enabledMetrics');
      btnMetrics = this.lookupReference('btnMetrics');
      menuItems = [];
      btnText = [];
      availableMetrics.forEach(function(metric) {
        var isChecked;
        if (metric.id.match(/^all_/)) {
          return;
        }
        isChecked = enabledMetrics.indexOf(metric.id) > -1;
        if (isChecked) {
          btnText.push(metric.name);
        }
        return menuItems.push({
          xtype: 'menucheckitem',
          text: metric.name,
          metricName: metric.id,
          checked: isChecked ? true : void 0
        });
      });
      btnMetrics.menu.add(menuItems);
      btnMetrics.setText(btnText.join(', ') || btnMetrics.defaultText);
      return btnMetrics.enable();
    },
    onChangeMetrics: function(menu) {
      var btnMetrics, checkedItems;
      btnMetrics = this.lookupReference('btnMetrics');
      checkedItems = menu.items.filter('checked', true);
      btnMetrics.setText(checkedItems.collect('text').join(', ') || btnMetrics.defaultText);
      this.getVM().set('enabledMetrics', checkedItems.collect('metricName'));
      return this.getView().saveState();
    },
    onChangeDate: function(item) {
      this.getVM().set({
        rangeFrom: item.from,
        rangeTo: item.to,
        timePickerText: item.text
      });
      return this.getView().saveState();
    },
    onChangeResolution: function(picker, btn) {
      this.getVM().set('resolution', btn.value);
      return this.getView().saveState();
    }
  });

}).call(this);
