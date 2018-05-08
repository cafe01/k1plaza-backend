Ext.define('q1plaza.model.Tag', {
    extend: 'q1plaza.model.Base',
    fields: [ 'name', 'slug' ],
    proxy: {
        url: '/.resource/tag'
    }
});
