/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console */

Ext.define('q1plaza.view.system.FormLogController', {
    extend: 'q1plaza.base.ViewController',
    alias: 'controller.system-formlog',

    onSelectItem: function(grid, record) {
        var me = this,
            details = me.lookupReference('details'),
            data = record.get('data'),
            html = '<em>'+ JSON.stringify(data, null, 2) + '</em>';

        details.update(html.replace(/\n/g, '<br>'));
    }

});
