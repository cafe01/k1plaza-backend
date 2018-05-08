Ext.define('q1plaza.model.Agenda', {
    extend: 'q1plaza.model.Base',

    fields: [
        'id',
        'title',
        {
            name: 'date',
            type: 'date',
            dateFormat: "Y-m-d H:i:s"
        },
        {
            name: 'is_published',
            type: 'boolean'
        }
    ],

    proxy: {
        extraParams: { include_unpublished: 1, redirect: 0 }
    }
});
