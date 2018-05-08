/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define('q1plaza.view.gallery.EditPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.gallery-editpanel',
    data: {
        record: null,
        dirty: false
    }

});
