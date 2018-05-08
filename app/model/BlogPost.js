/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console*/

Ext.define('q1plaza.model.BlogPost', {
    extend: 'q1plaza.model.Base',

    requires:['q1plaza.model.Tag'],

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

    // manyToMany: ['Tag'],

    proxy: {
        extraParams: { include_unpublished: 1 }
    }
});
