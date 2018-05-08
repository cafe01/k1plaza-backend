/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console*/
Ext.define('q1plaza.view.blog.BlogModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.blog',
    requires: [
        'q1plaza.model.BlogPost',
        'q1plaza.model.Tag',
        'q1plaza.model.Category'
    ],

    data: {
        currentRecord: null
    },

    stores: {
        posts: {
            model: 'q1plaza.model.BlogPost',
            sorters:[{
                property: 'created_at',
                direction: 'DESC'
            }]
        },
        tags: {
            model: 'Tag',
            pageSize: 500
        },
        categories: {
            model: 'Category'
        }
    }

});
