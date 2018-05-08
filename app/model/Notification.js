Ext.define('q1plaza.model.Notification', {
    extend: 'q1plaza.model.Base',

    fields: [
        { name: 'created_at', type: 'date' }
    ],

    proxy: {
        type: 'rest',
        root: 'items',
        url: '/.resource/notifications'
    }
});
