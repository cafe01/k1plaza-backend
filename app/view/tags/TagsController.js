Ext.define('q1plaza.view.tags.TagsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tags-tags',

    init: function() {
        var me = this,
            view = me.getView(),
            grid = me.lookupReference('grid'),
            store = me.getStore('tags');

        store.getProxy().setExtraParams({
            widget: view.widgetName,
            redirect: 1,
            envelope: 1
        });

        if (view.categoryMode) {
            // store.setModel('Category');
            store.getProxy().setUrl('/.resource/category');
            // store.getProxy().setUrl('/.blog/category');
        }
        else {
            store.getProxy().setUrl('/.resource/tag');

        }

        grid.setStore(store);
        store.load();
    }

});
