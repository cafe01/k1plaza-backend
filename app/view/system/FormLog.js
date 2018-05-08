/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console */

Ext.define("q1plaza.view.system.FormLog",{
    extend: "Ext.panel.Panel",

    requires: [
        "q1plaza.view.system.FormLogController",
        "q1plaza.view.system.FormLogModel"
    ],

    xtype : "system-formlog",
    controller: "system-formlog",
    viewModel: {
        type: "system-formlog"
    },

    tbar: {
        padding: 12,
        defaults: {
            xtype: 'button',
            scale: 'large'
        },
        items: [
            {
                text: 'Deletar'
            }
        ]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
        bind: {
            store: '{formlogs}'
        }
    },
    
    ui: 'material',
    title: 'Log de formularios',
    glyph: 0xf03a,
    bodyBorder: true,
    layout: 'border',
    items: [
        {
            region: 'center',
            xtype: 'grid',
            cls: 'material-grid',
            bind: {
                store: '{formlogs}'
            },
            columns: [
                {
                    text: 'Nome do form',
                    dataIndex: 'form_name',
                    flex: 1
                },
                {
                    text: 'Enviado em',
                    dataIndex: 'created_at',
                    width: 300,
                    format: 'd/m/Y H:i:s'
                }
            ],

            listeners: {
                select: 'onSelectItem'
            }
        },

        {
            region: 'east',
            reference: 'details',
            title: 'Detalhes',
            width: 400,
            minWidth: 200,
            split: true,
            collapsible: true,
            bodyPadding: 15,
            style: 'font-size: 15px'
        }
    ]


});
