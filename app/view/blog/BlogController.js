/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console*/

Ext.define('q1plaza.view.blog.BlogController', {
    extend: 'q1plaza.base.ViewController',
    alias: 'controller.blog',
    requires: [
        'Ext.window.MessageBox',
        "q1plaza.view.tags.Tags"
    ],

    init: function() {
        'use strict';
        var me = this,
            view = me.getView(),
            widgetName = view.widgetRecord.get('name'),
            tags = me.getStore('tags'),
            categories = me.getStore('categories'),
            store = me.getStore('posts');

        me.vmSet('blogConfig', view.widgetRecord.get('config'));

        tags.getProxy().setExtraParam('widget', widgetName);
        categories.getProxy().setExtraParam('widget', widgetName);
        // store.getProxy().setUrl('/.widget/' + widgetName);
        store.setProxy({
            type: 'rest',
            url: '/.resource/blog/' + widgetName,
            extraParams: { include_unpublished: 1 },
            reader: {
                type: 'json',
                rootProperty: 'items'
            }
        });

        store.load();
        tags.load();
        categories.load();
    },

    onChangeCover: function(img, src, newMedia) {
        var me = this,
            record = img.$widgetRecord;
        record.set('thumbnail_url', src);
        record.store.sync();
    },

    onAddClick: function () {
        'use strict';
        var me = this,
            store = me.getStore('posts'),
            record = Ext.create('q1plaza.model.BlogPost', { title: 'Nova publicação' });

        store.add(record);
        me.lookupReference('grid').setSelection(record);
        store.sync({
            success: function() {
                me.lookupReference('grid').getView().setScrollX(0, true);
                Ext.MessageBox.confirm('Nova Publicação', 'Uma nova publicação foi criada no modo rascunho ("despublicada").<br>Quando a publicação estiver pronta, clique no botao <strong>Publicar</strong> para exibi-la no website.<br><br>Deseja iniciar a o editor agora?', function(btn){
                    if (btn !== 'yes') { return; }
                    me.editSelected()
                });
                // Ext.Msg.show({
                //     title: 'P',
                //     message: 'Please enter your address:',
                //     width: 300,
                //     buttons: Ext.Msg.OKCANCEL,
                //     multiline: true,
                //     icon: Ext.window.MessageBox.INFO,
                //     fn: saveAddress,
                // });
            }
        });

    },


    editTitle: function() {
        var me = this,
            record = me.vmGet('grid.selection');

        Ext.Msg.prompt('Alterar Título', '', function(btn, value){

            if (btn !== 'ok' || !value.match(/\w+/)) { return; }
            record.set('title', value);
            record.store.sync();

        }, me, false, record.get('title')).setWidth(400).center();
    },

    editSelected: function(record) {
        var me = this,
            pagePath = me.vmGet('blogConfig.page_path'),
            win;

        if (!pagePath) {
            return alert("Faltando configuração 'page_path' do blog.");
        }

        record = record = me.vmGet('grid.selection');
        win = window.open(location.origin + "/" + pagePath + "/id/" + record.get('id') + "?include_unpublished=1&start_edit=1", 'post' + record.get('id'));
        if (!win) {
            Ext.Msg.alert("Atenção", "Seu navegador bloqueou a abertura de uma nova aba.<br>Conceda a permissão e clique novamente em <strong>Editar Publicação</strong>.");
            return;
        }
        win.onunload = function() { store.load() };
        return win;
    },

    deleteSelected: function () {
        'use strict';
        var me = this,
            vm = me.getViewModel(),
            record = vm.get('grid.selection'),
            store = me.getStore('posts'),
            message = Ext.String.format('Deletar publicação <b style="font-weight:500"style="font-weight:500">"{0}"</b>?', record.get('title'));

        Ext.MessageBox.confirm('Confirmação', message, function(btn){
            if (btn !== 'yes') { return; }
            store.remove(record);
            store.sync();
            me.showMessage('Post deletado.');
        });
    },

    togglePublished: function() {
        var me = this,
            vm = me.getViewModel(),
            record = vm.get('grid.selection'),
            serverWidget =  me.getView().widgetRecord.get('name');

        // record.getProxy().setUrl('/.widget/'+ serverWidget );
        record.set('is_published', record.get('is_published') ? 0 : 1);
        // record.save();
        record.store.sync({
            success: function() {
                me.showMessage()
            }
        });
    },

    openTagManager: function() {
        var me = this,
            tagsManager = Ext.widget('tagsmanager', { widgetName : me.getView().widgetRecord.get('name'), categoryMode: false });

        tagsManager.show();
    },

    openCategoriesManager: function() {
        var me = this,
            tagsManager = Ext.widget('tagsmanager', {
                widgetName : me.getView().widgetRecord.get('name'),
                categoryMode: true,
                title: 'Categorias',
                glyph: 0xf115
            });

        tagsManager.show();
    },

    editPostTags: function() {
        var me = this,
            record = me.vmGet('grid.selection');

        me.editTags({ record: record });
    },

    editPostCategories: function() {
        var me = this,
            record = me.vmGet('grid.selection');

        me.editTags({
            record: record,
            title: 'Categorias',
            glyph: 0xf07c,
            dataIndex: 'categories',
            model: 'Category'
        });
    },

    editTags: function(params) {
        params = Ext.apply({}, params, {
            title: 'Tags',
            model: 'Tag',
            dataIndex: 'tags',
            glyph: 0xf02c
        });

        var me = this,
            record = params.record,
            win = Ext.widget('window', {
                title: params.title + ': <strong>' + record.get('title') + '</strong>',
                glyph: params.glyph,
                layout: 'fit',
                // height: 250,
                width: 350,
                modal: true,
                items: {
                    xtype: 'form',
                    bodyPadding: 5,
                    layout: 'anchor',
                    items: {
                        xtype: 'tagfield',
                        cls: 'material',
                        anchor: '100%',
                        name: 'tags',
                        margin: 0,
                        value: record.get(params.dataIndex),
                        hideLabel: true,
                        displayField: 'name',
                        valueField: 'name',
                        filterPickList: true,
                        forceSelection: false,
                        createNewOnEnter: true,
                        createNewOnBlur: true,
                        queryMode: 'local',
                        store: {
                            model: params.model,
                            pageSize: 500,
                            autoLoad: true
                        }
                    },
                    bbar: [
                        {
                            text: 'Salvar',
                            scale: 'large',
                            handler: function() {
                                record.set(params.dataIndex, win.child('form').getValues().tags )
                                record.store.sync({
                                    success: function() {
                                        win.close()
                                    }
                                })
                            }
                        },
                        {
                            text: 'Cancelar',
                            scale: 'large',
                            handler: function() {
                                win.close();
                            }
                        }
                    ]
                }
            });


            win.show();
    }

});
