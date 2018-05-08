/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define("q1plaza.view.settings.Sitemap", {
    extend: "Ext.tree.Panel",

    requires: [
        "q1plaza.view.settings.SitemapController",
        "q1plaza.view.settings.SitemapModel"
    ],
    xtype: 'settings-sitemap',
    controller: "sitemap",
    viewModel: {
        type: "sitemap"
    },

    cls: 'x-sitemap-panel',
    glyph: 0xf0e8,
    reference: 'tree',
    // bodyPadding: 20,
    // ui: 'paper',
    tbar: {
        // padding: '20',
        defaults: {
            xtype: 'button',
            scale: 'large'
        },
        items: [{
                text: 'Nova Página',
                handler: 'createNode',
                ui: 'default'
            },
            ' ',
            {
                text: 'Editar',
                handler: 'editSelected',
                bind: {
                    disabled: '{!tree.selection}'
                }
            },
            {
                text: 'Salvar',
                handler: 'saveSitemap',
                // hidden: true,
                bind: {
                    disabled: '{!isDirty}'
                }
            },
            '-',
            {
                text: 'Remover',
                handler: 'deleteSelected',
                bind: {
                    disabled: '{!tree.selection}'
                }
            }
        ]
    },
    plugins: {
        pluginId: 'editor',
        ptype: 'rowediting',
        clicksToEdit: 2,
        listeners: {
            edit: 'onRowEdit'
        }
    },
    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            dragText: 'Arraste e solte para reorganizar.'
        }
    },
    columns: {
        defaults: {
            sorteable: false
        },
        items: [{
            xtype: 'treecolumn',
            text: 'Título',
            dataIndex: 'title',
            width: 200,
            editor: 'textfield'
        }, {
            text: 'Path',
            dataIndex: 'path',
            flex: 1,
            editor: 'textfield',
            renderer: function(value, meta, record) {
                return record.getPath('path', '/').replace('//', '/');
            }
        }, {
            text: 'Template',
            dataIndex: 'template',
            width: 150,
            editor: {
                xtype: 'combobox',
                queryMode: 'local',
                displayField: 'title',
                valueField: 'name',
                store: {
                    fields: ['name', 'title'],
                    data: backendConfig.templates
                }
            }

        }, {
            text: 'Widget',
            dataIndex: 'widget_args',
            width: 150,
            editor: {
                xtype: 'combobox',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'name',
                store: {
                    fields: ['name'],
                    data: backendConfig.widgets
                }
            }
        }]
    },
    rootVisible: false,
    store: {
        // type: 'tree',
        fields: ['path', 'title', 'template', 'widget_args'],
        // model: 'q1plaza.model.Page',
        defaultRootProperty: 'page',
        rootProperty: 'page',
        data: []

    },
    listeners: {
        itemcontextmenu: 'showItemContextMenu'
    }


});
