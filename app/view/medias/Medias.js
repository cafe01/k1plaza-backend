/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define("q1plaza.view.medias.Medias",{
    extend: "Ext.panel.Panel",

    requires: [
        "q1plaza.view.medias.MediasController",
        "q1plaza.view.medias.MediasModel",
        "q1plaza.plugin.DeleteDrop"
    ],
    xtype: 'medias',
    controller: "medias",
    viewModel: {
        type: "medias"
    },

    listeners: {
    },
    cls: 'x-medias-panel',
    glyph: 0xf03e,
    bind: {
    },

    plugins: [
        // { ptype: 'deletedrop', dropEl: 'header', deleteEventOnly: true }
    ],

    config: {
        mediaCollection: null,
        mediaMetadata: null
    },
    bodyStyle: {
        // backgroundColor: '#eee'
    },

    tbar: {
        padding: '20 20 0',
        defaults: {
            xtype: 'button',
            scale: 'large'
        },
        items: [
            {
                text: 'Enviar arquivo',
                handler: 'openFilePicker',
                ui: 'default'
            },
            ' ',
            {
                text: 'Baixar',
                handler: 'downloadSelected',
                bind: {
                    disabled: '{!grid.selection}'
                }
            },
            '-',
            {
                text: 'Deletar',
                handler: 'deleteSelected',
                bind: {
                    disabled: '{!grid.selection}'
                }
            }
        ]
    },

    layout: 'fit',

    items: [
        {
            xtype: 'grid',
            reference: 'grid',
            loadMask: true,
            margin: 20,
            ui: 'paper',
            cls: 'material-grid large',
            bind: {
                store: '{medias}'
            },
            multiSelect: true,
            listeners: {
                itemdblclick: 'viewSelected'
            },

            bbar: {
                xtype: 'pagingtoolbar',
                displayInfo: true,
                bind: {
                    store: '{medias}'
                }
            },

            columns: [
                {
                    xtype: 'widgetcolumn',
                    width: 50,
                    stopSelection: false,
                    menuDisabled: true,
                    resizable: false,
                    draggable: false,
                    widget: {
                        xtype: 'button',
                        scale: 'small',
                        text: '',
                        margin: '10 0 0 0',
                        ui: 'default-toolbar',
                        arrowVisible: false,
                        // glyph: 0xf078,
                        glyph: 0xf0d7,
                        menu: [
                            {
                                text: 'Exibir link (URL)',
                                handler: 'showLink'
                            },
                            {
                                text: 'Abrir em outra aba',
                                handler: 'viewSelected'
                            },
                            {
                                text: 'Baixar',
                                handler: 'downloadSelected'
                            },
                            '-',
                            {
                                text: 'Renomear',
                                handler: 'renameSelected'
                            },
                            '-',
                            {
                                text: 'Deletar',
                                handler: 'deleteSelected'
                            }
                        ]
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Nome',
                    width: 150,
                    dataIndex: 'file_name',
                    sortable: true,
                    flex: 1,
                    renderer: function(value, p, model) {
                        var img = Ext.String.format('<img src="{0}" width="70" height="53" style="float:left; margin:5px 15px 5px 0;"  />', model.get('thumbnail_url'));
                        return img + Ext.String.format('<div>{0}</div><div class="subinfo"><i class="fa fa-link"></i> <a href="{2}" target="{1}">{2}</a></div>',
                            value,
                            model.get('uuid'),
                            model.get('url'));
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Tamanho',
                    width: 130,
                    dataIndex: 'file_size',
                    renderer: function(value, p, model) {
                        return Ext.String.format('<div>{1}</div><div class="subinfo">{0:fileSize}</div>',
                            value,
                            model.get('width') + 'x' + model.get('height'));
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Tipo',
                    width: 130,
                    dataIndex: 'file_mime_type',
                    sortable: false
                },
                {
                    xtype: 'datecolumn',
                    width: 200,
                    dataIndex: 'created_at',
                    text: 'Enviado em',
                    format: 'd/m/Y'
                }
            ]
        }
    ]



});
