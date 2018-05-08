/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define("q1plaza.view.analytics.Analytics",{
    extend: "Ext.panel.Panel",

    requires: [
        "q1plaza.view.analytics.AnalyticsController",
        "q1plaza.view.analytics.AnalyticsModel",
        "q1plaza.view.analytics.Chart",
        "q1plaza.view.analytics.PieChart"
    ],

    xtype: 'analytics',
    controller: "analytics-analytics",
    viewModel: {
        type: "analytics-analytics"
    },

    title: 'Analytics',
    glyph: 0xf201,

    stateful: true,
    stateId: 'analyticsDashboard',

    tbar: {
        padding: '20 20 0',
        defaults: {
            // ui: 'default',
            scale: 'large'
        },
        items: [
            {
                // glyph: 0xf06e,
                // ui: 'default',
                disabled: true,
                reference: 'btnMetrics',
                defaultText: 'Escolher Informações',
                menu: {
                    xtype: 'menu',
                    items: [],
                    listeners: {
                        click: 'onChangeMetrics'
                    }
                }
            },
            '->',
            {
                reference: 'btnTimeRange',
                bind: {
                    text: '{timePickerText}'
                },
                menuAlign: 'tr-br',
                menu: {
                    defaults: {
                        xtype: 'menucheckitem',
                        group: 'analyticsTimePicker',
                        handler: 'onChangeDate'
                    },
                    items: [
                        { text: 'Hoje', from: 'today', to: 'now' },
                        { text: 'Ontem', from: 'yesterday', to: 'today' },
                        { text: 'Últimos 7 dias', from: '-7d', to: 'now' },
                        { text: 'Últimos 30 dias', from: '-30d', to: 'now' },
                        { text: 'Este mês', from: 'thismonth', to: 'now' },
                        { text: 'Este ano', from: 'thisyear', to: 'now' },
                        { xtype: 'menuseparator' },
                        {
                            xtype: 'menuitem',
                            text: 'Definir data',
                            glyph: 0xf073
                        }
                    ]
                }
            },
            {
                xtype: 'segmentedbutton',
                reference: 'resolutionPicker',
                defaults: {
                    scale: 'large'
                },
                items: [{
                    text: 'Por Mês',
                    value: '1mon'
                }, {
                    text: 'Semana',
                    value: '1w'
                }, {
                    text: 'Dia',
                    value: '1d'
                }, {
                    text: 'Hora',
                    value: '1h'
                }, {
                    text: 'Minuto',
                    value: '1min',
                    hidden: true
                }],
                listeners: {
                    toggle: 'onChangeResolution'
                }
            }
        ]
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'analytics-chart',
            reference: 'mainChart',
            // height: 300,
            flex: 1,
            margin: 20,
            ui: 'paper',
            bind: {
                params: '{queryParams}'
            }
        },
        {
            xtype: 'panel',
            flex: 1,
            ui: 'paper',
            margin: '0 20 20',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                flex: 1,
                // height: 300,
                xtype: 'analytics-piechart',
                bind: {
                    params: '{queryParams}'
                }
            },
            items: [
                {
                    metric: 'all_browsers'
                },
                {
                    metric: 'all_robots'
                },
                {
                    metric: 'all_devices'
                }
            ]
        }
    ],

    getState: function() {
        // return { data: this.getViewModel().getData() };
        var me = this,
            vm = me.getViewModel(),
            state = {
                enabledMetrics: vm.get('enabledMetrics'),
                rangeFrom: vm.get('rangeFrom'),
                rangeTo: vm.get('rangeTo'),
                resolution: vm.get('resolution')
            };

        // console.log('getstate', state);
        return state;
    },

    applyState: function(state) {
        this.getViewModel().setData(state);
    }
});
