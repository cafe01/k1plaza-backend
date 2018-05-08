/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define("q1plaza.view.gallery.Gallery",{
    extend: "Ext.panel.Panel",

    requires: [
        "q1plaza.view.gallery.GalleryController",
        "q1plaza.view.gallery.GalleryModel",
        "q1plaza.view.gallery.EditPanel",
        "q1plaza.plugin.DeleteDrop"
    ],
    xtype: 'mediaGallery',
    controller: "gallery",
    viewModel: {
        type: "gallery"
    },

    listeners: {
        reorder: 'onReorder'
    },
    cls: 'x-gallery',
    glyph: 0xf03e,
    bind: {
        activeItem: '{activeItem}'
    },

    plugins: [
        { ptype: 'deletedrop', dropEl: 'header' }
    ],

    config: {
        mediaCollection: null,
        mediaMetadata: null
    },
    bodyStyle: {
        backgroundColor: '#eee'
    },

    tbar: {
        padding: '20 20 0',
        defaults: {
            xtype: 'button',
            scale: 'large'
        },
        bind: {
            hidden: '{editMode}'
        },
        items: [
            {
                text: 'Adicionar',
                // glyph: 0xf093,
                handler: 'onAddClick',
                reference: 'btnAdd',
                ui: 'default'
            },
            ' ',
            {
                text: 'Editar',
                handler: 'onEditClick',
                reference: 'btnEdit',
                bind: {
                    disabled: '{!hasSingleSelection}'
                }
            },
            ' ',
            {
                text: 'Deletar',
                handler: 'onDeleteClick',
                reference: 'btnDelete',
                bind: {
                    disabled: '{!hasSelection}'
                }
            }
        ]
    },

    layout: 'card',

    items: [
        {
            xtype: 'dataview',
            reference: 'dataview',
            loadMask: false,
            margin: 20,
            bind: {
                store: '{medias}'
            },
            cls: 'dataview',
            padding: '0 0 20',
            tpl: [
                '<tpl for="."><div class="item-wrap"></div></tpl>'
            ],
            autoScroll: true,
            itemSelector: 'div.item-wrap',
            multiSelect: true,
            // scope: 'this',
            listeners: {
                beforerender: 'onDataviewBeforeRender',
                selectionchange: 'onSelectionChange',
                render: 'setupDragDrop',
                itemdblclick: 'onEditClick'
            }
        },
        {
            xtype: 'galleryEditPanel',
            reference: 'editPanel',
            listeners: {
                cancel: 'onEditComplete',
                save: 'onEditComplete'
            }
        }
    ],

    updateMediaCollection: function(id) {
        var me = this,
            store = me.getViewModel().getStore('medias');

        store.getProxy().setExtraParam('collection_id', id);
        // console.log('updateMediaCollection', id);
        if (me.autoLoad !== false) {
            store.load();
        }
    },

    reload: function() {
        this.getViewModel().getStore('medias').load();
    }
});
