/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console  */
Ext.define('q1plaza.view.settings.UsersModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.settings-users',
    data: {

    },
    stores: {
        users: {
            model: 'User',
            autoLoad: true,
            sorters:[{
                property: 'first_name',
                direction: 'ASC'
            }],
            remoteSort: true
        }
    }

});
