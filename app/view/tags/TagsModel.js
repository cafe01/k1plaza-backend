Ext.define('q1plaza.view.tags.TagsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tags-tags',
    requires: 'q1plaza.model.Tag',
    data: {},
    stores: {
        tags: {
            autoLoad: false,
            autoSync: true,
            model: 'Tag'
        }
    }
});
