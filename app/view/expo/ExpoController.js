/*global Ext, console, Q1Plaza */

Ext.define('q1plaza.view.expo.ExpoController', {
    extend: 'q1plaza.base.ViewController',
    alias: 'controller.expo-expo',

    requires: [
        "q1plaza.view.expo.ExpoItemEditor",
        'Ext.menu.Menu'
    ],

    init: function() {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            websiteConfig = me.vmGet('config'),
            locales = websiteConfig.locales,
            store = me.getStore('albums'),
            proxy = store.getProxy(),
            gallery = me.lookupReference('gallery')

        // console.log('expoConfig', view.widgetRecord.data.config);
        vm.set('expoConfig', view.widgetRecord.data.config);

        // locales
        if (locales) {
            vm.set('locales', locales);
            vm.set('activeLocale', locales[0]);
            var localesMenu = me.lookupReference('localesButton').getMenu();
            Ext.each(locales, function(locale) {
                localesMenu.add({
                    text: locale,
                    handler: function() { me.setLocale(locale) }
                });
            });

            proxy.setExtraParam('locale', locales[0]);
        }

        gallery.serverWidget = view.serverWidget;
        gallery.setMediaMetadata(view.widgetRecord.data.config.media_metadata);
        proxy.setUrl('/.resource/expo/' + view.serverWidget);
        store.setPageSize(200);

        // select 1st on load
        store.on('load', function(store, records){
            if (records.length === 0) { return; }
            me.lookupReference('grid').getSelectionModel().select(records[0]);
        }, me, { single: true });

        store.load();

        // monitor gallery editMode
        gallery.getViewModel().bind('{editMode}', function(editMode){
            me.vmSet('editMode', editMode);
        });

        // relay gallery events
        view.relayEvents(gallery, ['startdeletedrag', 'enddeletedrag']);
    },

    setLocale: function(locale) {
        var me = this;
        if (locale == me.vmGet('activeLocale')) {
            return;
        }

        me.vmSet('activeLocale', locale);
        var store = me.getStore('albums')
        store.getProxy().setExtraParam('locale', locale);
        store.on('load', function(store, records){
            if (records.length === 0) { return; }
            me.lookupReference('grid').getSelectionModel().select(records[0]);
        }, me, { single: true });
        store.load();

    },

    onSelectionChange: function(grid, records) {
        var me = this,
            vm = me.getVM(),
            record = records[0],
            gallery = me.lookupReference('gallery');

        vm.set('selectedRecord', record);
        if (record) {
            gallery.setMediaCollection(record.get('mediacollection_id'));
            gallery.reload();
        }
    },

    onAddClick: function() {
        var me = this;

        Ext.Msg.prompt('Novo album', '', function(btn, value){

            if (btn !== 'ok' || !value.match(/\w+/)) { return; }
            var store = me.getStore('albums'),
                Model = store.getModel(),
                record = new Model({
                    title: value,
                    is_published: false,
                    locale: me.vmGet('activeLocale')
                });

            record.save({
                success: function() {
                    store.add(record);
                    me.lookupReference('grid').getSelectionModel().select(record);
                    me.showMessage();
                },
                failure: function() {
                    me.showError();
                }
            });

        }).setWidth(350).center();
    },

    onTogglePublish: function() {
        var me = this,
            record = me.getVM().get('selectedRecord');

        if (!record) { return; }

        record.set('is_published', !record.get('is_published'));

        record.save({
            success: function() {
                me.showMessage();
            },
            failure: function(){
                me.showError();
            }
        });
    },

    onEditClick: function() {
        var me = this,
            widget = me.getView().widgetRecord.data,
            widgetConfig = widget.config,
            metadata = widgetConfig.metadata || {},
            record = me.getVM().get('selectedRecord'),
            editor = Ext.widget('expoItemEditor', {
                defaultListenerScope: true,
                // animateTarget: itemEl,
                constrainTo: me.getView(),
                enableTags: parseInt(widgetConfig.enable_tags, 10) === 1,
                widgetName: widget.name,
                metadata: metadata
            });

        editor.show();
        // editor.setFields(Q1Plaza.app.generateFormFields(metadata));
        editor.loadRecord(record);

        editor.on({
            savesuccess: function() {
                me.showMessage();
            },
            savefailure: function() {
                me.showError();
            }
        });

        // console.log('edit album', record, record.get('title'));

        // Ext.Msg.prompt('Alterar nome do álbum', '', function(btn, value){
        //
        //     if (btn !== 'ok' || !value.match(/\w+/)) { return; }
        //
        //     record.set('title', value);
        //     record.save({
        //         success: function() {
        //             me.showMessage();
        //         },
        //         failure: function() {
        //             me.showError();
        //         }
        //     });
        //
        // }, null, null, record.get('title')).setWidth(350).center();
    },

    onItemReorder: function(node, data, dst, dropPosition) {
        var me = this,
            widgetName = me.getView().serverWidget,
            src = data.records[0];

        Ext.Ajax.request({
            url: '/.resource/expo/'+widgetName+'/reposition',
            method: 'post',
            jsonData: { from: src.get('id'), to: dst.get('id') },
            failure : function() {
                me.showError('Erro ao reordenar. :(');
            }
        });
    },

    onDeleteDrop: function() {
        var me = this,
            grid = me.lookupReference('grid'),
            store = grid.getStore(),
            sm = grid.getSelectionModel(),
            records = sm.getSelection(),
            count = records.length,
            format = Ext.String.format,
            message = count > 1 ? format('Realmente deseja deletar os <b>{0} itens</b> selecionados?', count) : format('Realmente deseja deletar o item selecionado?'),
            lastIndex;

        if (count === 0) { return; }

        lastIndex = store.indexOf(records[records.length-1]);
        // console.log('lastIndex', lastIndex);

        Ext.MessageBox.confirm('Confirmação', message, function(btn){
            if (btn !== 'yes') { return; }
            //console.log(arguments);
            store.remove(records);
            store.sync();
            me.showMessage('Ok.');
            sm.select(lastIndex <= (store.getCount() - 1) ? lastIndex : store.getCount() - 1);
        });
    },

    showItemActionMenu: function(evt, target) {
        var me = this,
            grid = me.lookupReference('grid'),
            itemEl = Ext.fly(target).parent(grid.view.itemSelector, true),
            record = grid.view.getRecord(itemEl),
            menu = me.itemActionMenu;

        if (!menu) {

            menu = Ext.widget('menu', {
                items: [
                    { text: 'Editar', handler: 'onEditClick', scope: me },
                    { text: 'Publicar', itemId: 'publish', handler: 'onTogglePublish', scope: me },
                    { text: 'Despublicar', itemId: 'unpublish', handler: 'onTogglePublish', scope: me },
                    '-',
                    { text: 'Deletar', handler: 'onDeleteDrop', scope: me }
                ]
                // listeners: {
                //     click: 'onMenuClick',
                //     scope: me
                // }
            });

            me.itemActionMenu = menu;
        }

        // show hide items
        menu.child('#publish').setVisible(!record.get('is_published'));
        menu.child('#unpublish').setVisible(record.get('is_published'));

        menu.record = record;
        menu.showBy(target, 'tl-bl', [0, 5]);
    },

    openTagManager: function() {
        var me = this,
            tagsManager = Ext.widget('tagsmanager', { widgetName : me.getView().serverWidget });

        tagsManager.show();
    }

});
