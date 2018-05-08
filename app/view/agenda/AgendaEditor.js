/*jslint white:true, unparam: true, sloppy: true */
/*global Ext, console */

Ext.define("q1plaza.view.agenda.AgendaEditor",{
    extend: "Ext.panel.Panel",

    requires: [
        "q1plaza.view.agenda.AgendaEditorController",
        "q1plaza.view.agenda.AgendaEditorModel",
        "q1plaza.form.RichEditor"
    ],

    xtype: 'agendaEditor',
    controller: "agenda-agendaeditor",
    viewModel: {
        type: "agenda-agendaeditor"
    },

    glyph: 0xf044,

    cls: 'x-agenda-editor',

    config: {
        record: null,
        title: 'Agenda Editor'
    },

    publishes: ['record'],

    bind: {
        record: '{record}',
        title: '{record.title}'
    },

    layout: {
        type: 'border'
    },

    listeners: {
        afterrender: 'onAfterRender'
    },

    tbar: {
        layout: {
            // pack: 'middle'
        },
        defaults: {
            xtype: 'button',
            scale: 'medium'
        },
        padding: 15,
        items: [
            {
                xtype: 'displayfield',
                reference: 'titleField',
                cls: 'action-link',
                maxWidth: 500,
                style: {
                    fontSize: 20
                },
                bind: '{record.title}',
                inputAttrTpl: 'data-qtip="Alterar nome do evento"'
            },
            ' ',
            {
                text: 'Salvar',
                handler: 'onSaveClick',
                ui: 'default',
                bind: {
                    disabled: '{!dirty}'
                }
            },
            {
                text: 'Publicar',
                handler: 'onPublishClick',
                value: 1,
                bind: {
                    hidden: '{record.is_published}'
                }
            },
            {
                text: 'Despublicar',
                handler: 'onPublishClick',
                value: 0,
                bind: {
                    hidden: '{!record.is_published}'
                }
            },

            {
                text: 'Fechar',
                handler: 'onCloseClick'
            }
        ]
    },

    items: [
        // side
        {
            xtype: 'panel',
            region: 'east',
            cls: 'box-shadow',
            preventHeader: true,
            width: 420,
            minWidth: 220,
            margin: '10 15 10 0',
            bodyPadding: 20,
            collapsible: true,
            hideCollapseTool: true,
            split: true,
            defaults: {
                xtype: 'textfield',
                labelAlign: 'top',
                allowBlank: false
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    fieldLabel: 'Data',
                    xtype: 'datefield',
                    bind: {
                        value: '{eventDate}'
                    }
                },
                {
                    fieldLabel: 'Hora',
                    xtype: 'timefield',
                    increment: 30,
                    bind: {
                        value: '{eventTime}'
                    }
                },
                {
                    fieldLabel: 'Local',
                    allowBlank: true,
                    bind: {
                        value: '{record.venue}'
                    }
                },
                {
                    fieldLabel: 'Preço',
                    xtype: 'numberfield',
                    minValue: 0,
                    bind: {
                        value: '{record.price}'
                    }
                },
                {
                    fieldLabel: 'Link para compra do ingresso',
                    allowBlank: true,
                    bind: {
                        value: '{record.ticket_url}'
                    }
                },
                {
                    fieldLabel: 'Ingressos esgotados',
                    labelAlign: 'left',
                    labelWidth: 150,
                    xtype: 'checkboxfield',
                    bind: {
                        value: '{record.is_soldout}'
                    }
                },
                {
                    fieldLabel: 'Evento cancelado',
                    xtype: 'checkboxfield',
                    labelAlign: 'left',
                    labelWidth: 150,
                    bind: {
                        value: '{record.is_canceled}'
                    }
                }
            ]
        },

        // center
        {
            region: 'center',
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'center'
            },
            padding: '0 10',
            items: [{
                xtype: 'richeditor',
                cls: 'box-shadow',
                maxWidth: 620,
                margin: '10 0',
                flex: 1,
                bind: {
                    value: '{record.content}'
                }
            }]
        }
    ]

});
