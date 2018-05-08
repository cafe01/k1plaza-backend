/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, Q1Plaza */

Ext.define('q1plaza.view.expo.ExpoModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.expo-expo',
    requires: ['q1plaza.model.Expo'],
    data: {
        selectedRecord: null
    },

    stores: {
        albums: {
            model: 'Expo'
        }
    },

    formulas: {
        publishBtnGlyph: {
            bind: '{selectedRecord}',
            get: function(rec) {
                return rec && rec.get('is_published') ?  0xf070 : 0xf06e;
            }
        }
    }

});
