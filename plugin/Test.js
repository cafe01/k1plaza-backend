/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console, backendConfig */

Ext.define('backend.plugin.Test', {

    alias: 'app-plugin.Test',

    init: function(app) {
        var me = this;

        me.app = app;
        console.log('[init] test plugin');

        app.on('render', me.onRender, me);
    },

    onRender: function(app, view) {
        var me = this,
            toolbar = app.getToolbar();

        console.log('app render', app, toolbar);

        // app toolbar
        toolbar.add({
            text: 'Injected by plugin'
        });
    }
});
