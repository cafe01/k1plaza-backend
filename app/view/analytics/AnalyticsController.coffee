# coffeelint: disable=indentation,max_line_length

Ext.define('q1plaza.view.analytics.AnalyticsController',
    extend: 'q1plaza.base.ViewController'
    alias: 'controller.analytics-analytics'

    init: () ->
        view = @getView()
        @vmSet('mainChart', @lookupReference('mainChart')) # hack?! why its not already in vm?
        @initMetricsMenu()
        @initTimeRangeMenu()
        @initResolution()

    initResolution: () ->
        resolution = @getVM().get 'resolution'
        @lookupReference('resolutionPicker').items
                                            .findBy((item) -> item.value == resolution)
                                            .setPressed(true)

    initTimeRangeMenu: () ->
        vm = @getVM()
        rangeFrom = vm.get 'rangeFrom'
        rangeTo = vm.get 'rangeTo'
        btnTimeRange = @lookupReference 'btnTimeRange'
        checkedItem = btnTimeRange.menu.items.findBy((item) -> item.to == rangeTo and item.from == rangeFrom)

        if checkedItem
            checkedItem.setChecked on
            vm.set 'timePickerText', checkedItem.text

    initMetricsMenu: () ->
        vm = @getVM()
        availableMetrics = vm.get('config.availableMetrics')
        enabledMetrics = vm.get('enabledMetrics')
        btnMetrics = @lookupReference('btnMetrics')
        menuItems = []
        btnText = []

        availableMetrics.forEach((metric) ->
            return if metric.id.match(/^all_/)
            isChecked = enabledMetrics.indexOf(metric.id) > -1
            btnText.push(metric.name) if isChecked

            menuItems.push({
                xtype: 'menucheckitem'
                text: metric.name
                metricName: metric.id
                checked: true if isChecked
            })
        )

        btnMetrics.menu.add(menuItems)
        btnMetrics.setText(btnText.join(', ') || btnMetrics.defaultText)
        btnMetrics.enable()

    onChangeMetrics: (menu) ->
        btnMetrics = @lookupReference('btnMetrics')
        checkedItems = menu.items.filter('checked', true)

        btnMetrics.setText checkedItems.collect('text').join(', ') || btnMetrics.defaultText
        @getVM().set 'enabledMetrics', checkedItems.collect('metricName')
        @getView().saveState()

    onChangeDate: (item) ->
        @getVM().set({
            rangeFrom: item.from
            rangeTo: item.to
            timePickerText: item.text
        })

        @getView().saveState()

    onChangeResolution: (picker, btn) ->
        @getVM().set('resolution', btn.value)
        @getView().saveState()


)
