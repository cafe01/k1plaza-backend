/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console  */

Ext.define('q1plaza.view.user.ProfileModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.user-profile',

    data: {
        record: null
    },

    formulas: {
        dirty: {
            bind: {
                bindTo: '{loggedInUser}',
                deep: true
            },
            get: function(data){
                console.log('user dirty', data);
                return data ? data.dirty : false;
            }
        }
    }

});
