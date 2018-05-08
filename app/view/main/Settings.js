/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console  */

Ext.define("q1plaza.view.main.Settings",{
    extend: "Ext.tab.Panel",

    requires: [
        "q1plaza.view.main.SettingsController",
        "q1plaza.view.settings.Custom",
        "q1plaza.view.settings.Sitemap",
        "q1plaza.view.settings.Users"
    ],
    xtype: 'main-settings',
    controller: "main-settings",

    title: 'Configurações',
    glyph: 0xf085,
    tabPosition: 'top',
    tabRotation: 0,
    // tabBarHeaderPosition: 1,
    // bodyPadding: '0 0 0 20',
    bodyPadding: '10 20 20',
    defaults: {
        ui: 'paper'
    },
    activeTab: 0,
    items: [
        {
            xtype: 'settings-custom',
            title: 'Configurações',
            glyph: 0xf085
        },
        {
            xtype: 'settings-sitemap',
            title: 'Sitemap',
            hidden: !backendConfig.enable_cms,
            // bind: { hidden: 'config.enable_cms' },
            glyph: 0xf0e8
        },
        {
            // xtype: 'settings-widgets',
            title: 'Widgets',
            hidden: !backendConfig.enable_cms || !backendConfig.devMode,
            glyph: 0xf1b3,
            html: 'Coming soon...'
        },
        {
            xtype: 'settings-users',
            title: 'Usuarios & Grupos',
            glyph: 0xf0c0,
            html: 'Coming soon...'
        }
    ],
    listeners: {
        tabchange: 'onTabChange'
    }
});
