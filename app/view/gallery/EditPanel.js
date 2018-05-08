/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define("q1plaza.view.gallery.EditPanel",{
    extend: "Ext.panel.Panel",

    requires: [
        "q1plaza.view.gallery.EditPanelController",
        "q1plaza.view.gallery.EditPanelModel",
        "Ext.form.Panel"
    ],

    xtype: 'galleryEditPanel',
    controller: "gallery-editpanel",
    viewModel: {
        type: "gallery-editpanel"
    },

    cls: 'x-gallery-editpanel',

    config: {
        record: null,
        fields: []
    },

    tbar: {
        padding: '20 20 0',
        defaults: {
            xtype: 'button',
            scale: 'large'
        },
        items: [
            {
                text: 'Salvar',
                handler: 'onSaveClick',
                ui: 'default',
                disabled: true,
                bind: {
                    disabled: '{!dirty}'
                }
            },
            ' ',
            {
                text: 'Fechar',
                handler: 'onCloseClick'
            }
        ]
    },

    layout: 'border',

    defaults: {
        bodyPadding: 25
    },

    items:[
        {
            region: 'center',
            xtype: 'panel',
            margin: 20,
            cls: 'details-panel',
            ui: 'paper',
            reference: 'details',
            tpl:[
                // '{[ console.log(values) ]}',
                '<img src="/.media/file/{uuid}_600x.jpg">',
                '<div><span class="label">Nome do arquivo</span><span>{file_name}</span></div>',
                '<div><span class="label">Dimensões</span><span>{width}x{height}</span></div>',
                '<div><span class="label">Tamanho</span><span>{file_size:fileSize}</span></div>',
                '<div><span class="label">Tipo</span><span>{file_mime_type}</span></div>',
                '<div><span class="label">Link</span><a target="_blank" href="{url}">{url}</a></div>'
            ]
        },
        {
            region: 'west',
            ui: 'paper',
            xtype: 'form',
            trackResetOnLoad: true,
            reference: 'editor',
            width: 420,
            margin: '20 0 20 20',
            defaults: {
                labelAlign: 'top'
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [],
            listeners: {
                dirtychange: 'onDirtyChange'
            }
        }
    ],

    applyFields: function(fields) {
        var me = this,
            editor = me.lookupReference('editor');

        if (!editor) { return; }

        editor.removeAll();
        editor.add(fields);
    },

    setRecord: function(rec) {
        var me = this;
        me.callParent(arguments);
        me.getViewModel().set('record', rec);
        me.lookupReference('details').update(rec.data);
        me.lookupReference('editor').loadRecord(rec);
    }
});
