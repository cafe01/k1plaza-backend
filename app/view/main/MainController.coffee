# coffeelint: disable=indentation,max_line_length
# out: ./$1.js
Ext.define('q1plaza.view.main.MainController',

    extend: 'q1plaza.base.ViewController'
    requires: ['q1plaza.model.User']
    alias: 'controller.main'

    control:
        '#centerPanel panel':
            activate: 'onChangeView'

    init: ->
        vm = @getViewModel()

        # @getStore('menuItems').on('load', @onMenuLoad, @)
        @initMenu()

        # set our reference
        vm.set('main', @)

        # load user
        Ext.Ajax.request({
            url: '/.resource/user/me'
            success: (xhr) ->
                vm.set('loggedInUser', Ext.create('q1plaza.model.User', Ext.decode(xhr.responseText)))
        })

    initMenu: (store) ->

        lastOpenWidget = Ext.state.Manager.get('lastOpenWidget')
        lastOpenWidgetRecord = null
        store = @getStore('menuItems')
        Model = store.getModel()
        items = []
        groups = {}
        groupsConfig = @vmGet('config').menu_groups || {}

        _.each(@vmGet('config').widgets || [], (widget) ->

            return unless widget.config.backend_view

            config = widget.config
            widget.title = widget.config.title
            widget.view = widget.config.backend_view
            widget.viewConfig = widget.config.backend_view_config
            widget.icon = widget.viewConfig.menuIcon

            widget = Ext.create 'q1plaza.model.Widget', widget
            if widget.get('name') == lastOpenWidget
                widget.set('active', true)
                lastOpenWidgetRecord = widget

            if config.menu_group
                groups[config.menu_group] ||= Ext.apply({
                    title: config.menu_group
                    icon: 'list'
                    isGroup: true
                    items: []
                }, groupsConfig[config.menu_group] || {})

                group = groups[config.menu_group]

                # console.log widget.title, 'has menu group', group
                group.items.push(widget)
            else
                items.push(widget)
        )



        # hide hidden
        store.filterBy((rec) -> true unless rec.get('hidden'))

        # add groups
        for name, group of groups
            items.push group

        # add system menu cls
        items.push(_.map(@getView().menuItems, (item) -> item.cls = 'system-item'; item ) ...)

        # add to store
        store.add(items)

        if lastOpenWidgetRecord
            @openWidgetByRecord(lastOpenWidgetRecord)
        # else
        #     @openWidget('analytics')

        @fireViewEvent('menuready')
        fn = -> Ext.getBody().addCls('menu-ready')
        setTimeout fn, 100

    onMenuItemClick: (evt, element) ->
        el = Ext.fly(element)
        store = @getStore('menuItems')
        record = store.getById(el.getAttribute('data-item-id'))

        unless record
            return console.error 'menu record not found', el.getAttribute('data-item-id'), el

        if record.get('isGroup')
            return @showMenuGroupItems(evt, record)

        if (record.get('view'))
            @openWidgetByRecord(record)

        if (record.get('handler'))
            @[record.get('handler')].call(@)

        if (record.get('href'))
            window.open record.get('href')

    showMenuGroupItems: (evt, group) ->
        menuItems = []
        vm = @
        _.each group.get('items'), (record) ->
            menuItems.push
                text: record.get('title')
                handler: -> vm.openWidgetByRecord record

        # console.log 'shoeMenu', evt, menuItems
        menu = Ext.widget 'menu', {
            items: menuItems
        }
        menu.showAt evt.getXY()


    openWidgetByRecord: (record) ->
        data = record.data
        xtype  = data.view || data.name
        id = 'widget-' + record.get('id')

        widgetConfig = Ext.apply({}, data.viewConfig || {}, {
            title: data.title
            serverWidget: data.name
            widgetRecord: record
        })

        Ext.state.Manager.set('lastOpenWidget', data.name)
        @openWidget(id, xtype, widgetConfig)

    openWidget: (widgetId, widgetXtype, config) ->
        centerPanel = @lookupReference('centerPanel')
        widget = centerPanel.getComponent(widgetId)

        config = config || {}
        widgetXtype = widgetXtype || widgetId

        #console.log('openWidget()', widgetId)

        # create widget if not found
        unless widget
            Ext.apply(config, {
                itemId: widgetId
                closeable: true
            })

            widget = Ext.widget(widgetXtype, config)
            centerPanel.add(widget)

        centerPanel.setActiveItem(widget)
        return widget

    setActiveItem: (panel) ->
        @lookupReference('centerPanel').setActiveItem(panel)


    onChangeView: (panel) ->
        # deactivate all menu items, then activate the one
        menuItems = @getStore('menuItems')
        menuItems.each((item) -> item.set('active', false))

        panel.widgetRecord.set('active', true) if panel.widgetRecord
        @lookupReference('mainMenu').update(menuItems)

    onBeforeAddPanel: (centerPanel, panel) ->
        panel.setUI('main-panel')

    onLogoutClick: () ->
        Ext.MessageBox.confirm('Confirmação', 'Sair do painel de controle?', (btn) ->
            return if btn != 'yes'
            window.location = '/.logout'
        )
)
