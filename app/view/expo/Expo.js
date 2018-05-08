/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console  */

Ext.define("q1plaza.view.expo.Expo",{
    extend: "Ext.panel.Panel",

    requires: [
        "q1plaza.view.expo.ExpoController",
        "q1plaza.view.expo.ExpoModel",
        "q1plaza.view.gallery.Gallery",
        "q1plaza.plugin.DeleteDrop",
        "q1plaza.view.tags.Tags"
    ],

    xtype: 'expoEditor',
    controller: "expo-expo",
    viewModel: {
        type: "expo-expo"
    },

    title: 'Expo',
    cls: 'x-expo',

    glyph: 0xf0c0,
    layout: 'border',

    plugins: [
        { ptype: 'deletedrop', dropEl: 'header', deleteEventOnly: true }
    ],

    listeners: {
        deletedrop: 'onDeleteDrop'
    },

    items: [
        {
            xtype: 'panel',
            region: 'west',
            width: 260,
            bodyStyle: {
                backgroundColor: '#eee'
            },
            tbar: {
                padding: '20 0 0 20',
                defaults: {
                    scale: 'large',
                    bind: {
                        disabled: '{editMode}'
                    }
                },
                items: [
                    {
                        text: 'Novo album',
                        // glyph: 0xf067,
                        // ui: 'default',
                        handler: 'onAddClick'
                    }, '->',
                    {
                        width: 40,
                        glyph: 0xf02c,
                        handler: 'openTagManager',
                        bind: {
                            hidden: '{!expoConfig.enable_tags}'
                        }
                    },
                    {
                        text: 'locale',
                        reference: 'localesButton',
                        menu:[],
                        bind: {
                            text: '{activeLocale}',
                            hidden: '{!locales}'
                        }

                    }
                ]
            },
            layout: 'fit',
            items: {
                xtype: 'grid',
                reference: 'grid',
                margin: '20 5 20 20',
                loadMask: true,
                hideHeaders: true,
                cls: 'material-grid',
                ui: 'paper',
                viewConfig: {
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        dragText: 'Arraste e solte para reordenar',
                        ddGroup: {
                            deleteDrop: true,
                            expoDD: true
                        },
                        dragZone: {
                            onStartDrag: function() {
                                this.view.findParentByType('expoEditor').fireEvent('startdeletedrag');
                            },
                            onEndDrag: function() {
                                this.view.findParentByType('expoEditor').fireEvent('enddeletedrag');
                            }
                        }
                    },
                    listeners: {
                        drop: 'onItemReorder'
                    }
                },
                bind: {
                    store: '{albums}',
                    disabled: '{editMode}'
                },
                listeners: {
                    selectionchange: 'onSelectionChange',
                    itemdblclick: 'onEditClick',
                    click: {
                        fn: 'showItemActionMenu',
                        element: 'body',
                        delegate: 'div.btn-actions'
                    }
                },
                columns: [
                    {
                        text: 'Album',
                        flex: 1,
                        dataIndex: 'title',
                        sortable: false,
                        hideable: false,
                        menuDisabled: true,
                        draggable: false,
                        resizable: false,
                        renderer: function(value, meta, model) {
                            function a(html) { return '<a>'+html+'</a>'; }
                            function span(html) { return '<span>'+html+'</span>'; }
                            function icon(iconName, color, tip) {
                                return Ext.String.format('<i class="fa fa-{0} fa-fw" style="color:{1};" ></i> ',
                                    iconName,
                                    color || 'inherit',
                                    tip || '');
                            }

                            var format = Ext.String.format,
                                map = Ext.Array.map,
                                tpl = [
                                    '<div class="btn-actions" style="z-index:10000;"><i class="fa fa-chevron-down fa-fw" title="Exibir ações"></i></div>',
                                    '<div style="float:left; margin-right:5px">{0}</div>',
                                    '<div style="overflow: hidden; text-overflow: ellipsis;">{1}</div>'
                                    // '<div class="subinfo">{2}</div>'
                                ],
                                tags = map(model.get('tags'), function(item) {
                                    return a(item);
                                }).join(', ');

                            value = Ext.String.htmlEncode(value);
                            meta.tdAttr = 'title="' + value + '"';

                            return format(tpl.join(''),
                                (model.data.is_published ? '' : icon('eye-slash', '', 'Esse album não está publicado no website.')),
                                value
                                // span( (tags ? icon('tags') : icon('warning', '#FF9800')) + (tags || '(sem tags)') )
                                // span( (categories ? icon('folder') : icon('warning', '#FF9800')) + (categories || '(sem categorias)') )
                            );
                        }
                    }
                ]
            }
        },

        // gallery
        {
            xtype: 'mediaGallery',
            region: 'center',
            reference: 'gallery',
            autoLoad: false,
            header: false
        }
    ]
});
