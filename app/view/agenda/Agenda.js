/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext */

Ext.define("q1plaza.view.agenda.Agenda",{
    extend: "Ext.panel.Panel",
    requires: [
        "Ext.toolbar.Paging",
        "Ext.button.Segmented",
        "q1plaza.view.agenda.AgendaController",
        "q1plaza.view.agenda.AgendaModel"
    ],

    xtype: 'agenda',
    controller: "agenda",
    viewModel: {
        type: "agenda"
    },

    cls: 'x-agenda material-grid large',

    glyph: 0xf073,

    tbar: {
        padding: '20 20 0',
        overflowHandler: 'menu',
        defaults: {
            xtype: 'button',
            scale: 'large'
        },
        items: [
            {
                text: 'Adicionar',
                handler: 'onAddClick',
                ui: 'default'
            },
            {
                text: 'Editar',
                handler: 'onEditClick',
                bind: {
                    disabled: '{!currentRecord}'
                }
            },
            {
                text: 'Deletar',
                handler: 'onDeleteClick',
                bind: {
                    disabled: '{!currentRecord}'
                }
            },
            {
                text: 'Publicar',
                handler: 'onPublishToggle',
                value: 1,
                hidden: true,
                bind: {
                    hidden: '{currentRecord.is_published}'
                }
            },
            {
                text: 'Despublicar',
                handler: 'onPublishToggle',
                value: 0,
                hidden: true,
                bind: {
                    hidden: '{!currentRecord.is_published}'
                }
            },
            '->',
            {
                xtype: 'segmentedbutton',
                defaults: {
                    scale: 'large'
                },
                items: [{
                    text: 'Ver todos',
                    value: 'all'
                }, {
                    text: 'Futuro',
                    pressed: true,
                    value: 'future'
                }, {
                    text: 'Passado',
                    value: 'past'
                }],
                listeners: {
                    toggle: 'onPeriodClick'
                }
            }
        ]
    },

    layout: 'card',

    items:[
        {
            xtype: 'grid',
            reference: 'grid',
            margin: 20,
            ui: 'paper',
            bind: {
                store: '{agendaItems}'
            },
            listeners: {
                select: 'onSelectItem',
                itemdblclick: 'onEditClick'
            },
            bbar: {
                xtype: 'pagingtoolbar',
                displayInfo: true,
                bind: {
                    store: '{agendaItems}'
                }
            },
            columns: [
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'title',
                    text: 'Título',
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    renderer: function(value, p, model) {
                        return Ext.String.format('<div>{0}</div><div class="subinfo"><i class="fa fa-map-marker fa-fw"></i> {1}</div>',
                            value,
                            model.get('venue') || '' );
                    }
                },
                {
                    xtype: 'datecolumn',
                    width: 150,
                    dataIndex: 'date',
                    text: 'Data do Evento',
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    renderer: function(value, p, model) {
                        var format = Ext.Date.dateFormat;
                        return Ext.String.format('<div>{0}</div><div class="subinfo">às {1}</div>',
                            format(value, 'd/m/Y'),
                            format(value, 'H:i') );
                    }
                }
            ]
        }
    ]

});
