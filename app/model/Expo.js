/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console*/

Ext.define('q1plaza.model.Expo', {
    extend: 'q1plaza.model.Base',

    fields: [
        'id',
        'title',
        {
            name: 'created_at',
            type: 'date',
            dateFormat: "Y-m-d H:i:s"
        },
        {
            name: 'is_published',
            type: 'boolean'
        },
        {
            name: 'categories',
            type: 'auto',
            convert: function(value) {
                return Ext.Array.map(value || [], function(item){
                    return Ext.isString(item) ? item : item.name;
                });
            }
        },
        {
            name: 'tags',
            type: 'auto',
            convert: function(value) {
                return Ext.Array.map(value || [], function(item){
                    return Ext.isString(item) ? item : item.name;
                });
            }
        }
    ],

    proxy: {
        extraParams: { include_unpublished: 1, redirect: 1, envelope: 1 }
    }
});
