/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console*/

Ext.define('q1plaza.view.system.FormLogModel', {
    extend: 'Ext.app.ViewModel',
    requires:['q1plaza.model.FormLog'],
    alias: 'viewmodel.system-formlog',
    data: {},

    stores: {
        formlogs: {
            model: 'FormLog',
            autoLoad: true
        }
    }

});
