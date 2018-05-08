/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define('q1plaza.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    requires: ['q1plaza.model.Widget'],

    data: {
        loggedInUser: null
    },

    stores: {
        menuItems: {
            model: 'Widget'
        }
    }

});
