Ext.define('q1plaza.model.Data', {
    extend: 'q1plaza.model.Base',
    idProperty: 'name',
    fields: ['name', 'value'],
    proxy: {
        url: '/.resource/data'
    }
});
