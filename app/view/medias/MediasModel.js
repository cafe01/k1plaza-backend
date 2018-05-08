/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console  */
Ext.define('q1plaza.view.medias.MediasModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.medias',
    requires: [
        'q1plaza.model.Media'
    ],

    data: {
    },

    stores: {
        medias: {
            model: 'Media',
            pageSize: 100,
            remoteSort: true,
            remoteFilter: true,
            sorters:[{
                property: 'created_at',
                direction: 'DESC'
            }],
            proxy: {
                type: 'rest',
                startParam: '',
                url: '/.media',
                extraParams: { envelope: 1 },
                reader: {
                    type: 'json',
                    idProperty: 'id',
                    rootProperty: 'items'
                }
            }
        }
    }

});
