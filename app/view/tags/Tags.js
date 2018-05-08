
Ext.define('q1plaza.view.tags.Tags',{
    extend: 'Ext.window.Window',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.plugin.RowEditing',
        'q1plaza.view.tags.TagsController',
        'q1plaza.view.tags.TagsModel'
    ],

    xtype: 'tagsmanager',
    controller: 'tags-tags',
    viewModel: {
        type: 'tags-tags'
    },

    title: 'Tags',
    glyph: 0xf02c,

    width: 300,
    height: 400,
    modal: true,

    layout: 'fit',
    items: {
        xtype: 'grid',
        reference: 'grid',
        plugins: {
            ptype: 'rowediting',
            clicksToEdit: 1
        },

        columns: [
            {
                text: 'Nome',
                dataIndex: 'name',
                flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {
                text: 'ID',
                dataIndex: 'slug',
                flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    maskRe: /[a-z0-9-]/
                }
            }
        ]
    }
});
