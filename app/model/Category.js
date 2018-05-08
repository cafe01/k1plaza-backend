Ext.define('q1plaza.model.Category', {
    extend: 'q1plaza.model.Base',
    fields: [ 'name' ],
    proxy: {
        url: '/.resource/category'
    }
});
