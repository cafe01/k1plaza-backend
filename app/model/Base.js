Ext.define('q1plaza.model.Base', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.proxy.Rest'],
    // identifier: 'negative',
    schema: {
        namespace: 'q1plaza.model',
        proxy: {
            type: 'rest',
            startParam: '',
            reader: {
                type: 'json',
                idProperty: 'id',
                rootProperty: 'items'
            }
        }
    }
});
