

Ext.define 'q1plaza.view.main.SettingsController',
    extend: 'q1plaza.base.ViewController'
    alias: 'controller.main-settings'

    init: ->
        view = @getView()

    onTabChange: (tabPanel, tab)->
        tabPanel.setTitle tab.getTitle()
        tabPanel.setGlyph tab.getGlyph()
