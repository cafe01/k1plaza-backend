Ext.define('q1plaza.model.Media', {
    extend: 'q1plaza.model.Base',

    fields: [
        { name: 'id', type: 'int' },
        {
            name: 'created_at',
            type: 'date',
            dateFormat: "Y-m-d H:i:s"
        },
        'url', 'local_url', 'file_mime_type', 'uuid',

        {
            name: 'file_size',
            type: 'int'
        },

        {
            name: 'thumbnail_url',
            persist: false,
            calculate: function(data) {
                return Q1Plaza.app.uriForMedia(data, {
                    scale: '300x230',
                    crop: 1
                })
            }
        }
    ],

    proxy: {
        url: '/.media',
        extraParams: {
            envelope: 1
        }
    }
});
