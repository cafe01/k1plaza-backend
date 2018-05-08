/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext */

Ext.define("q1plaza.view.blog.Blog",{
    extend: "Ext.panel.Panel",

    requires: [
        "Ext.toolbar.Paging",
        "q1plaza.view.blog.BlogController",
        "q1plaza.view.blog.BlogModel",
        "q1plaza.model.Category",
        "q1plaza.model.Tag",
        'q1plaza.view.Image',
        "Ext.form.field.Tag"
    ],
    xtype: 'blogEditor',
    cls: 'x-blog-editor-grid',
    controller: "blog",
    viewModel: {
        type: "blog"
    },

    glyph: 0xf10d,

    tools: [{
        type:'help',
        tooltip: 'Me ajude!'
    }],


    tbar: {
        padding: '20 20 0',
        overflowHandler: 'menu',
        defaults: {
            xtype: 'button',
            scale: 'large'
        },
        items: [
            {
                text: 'Nova Publicação',
                handler: 'onAddClick',
                ui: 'default'
            },
            ' ',
            {
                text: 'Editar',
                handler: 'editSelected',
                bind: {
                    disabled: '{!grid.selection}'
                }
            },
            ' ',
            {
                text: 'Deletar',
                handler: 'deleteSelected',
                bind: {
                    disabled: '{!grid.selection}'
                }
            },
            ' ',
            {
                text: 'Publicar',
                handler: 'togglePublished',
                hidden: true,
                bind: {
                    hidden: '{grid.selection.is_published}',
                    disabled: '{!grid.selection}'
                }
            },
            {
                text: 'Despublicar',
                handler: 'togglePublished',
                hidden: true,
                bind: {
                    hidden: '{!grid.selection.is_published}',
                    disabled: '{!grid.selection}'
                }
            },
            {
                width: 40,
                glyph: 0xf02c,
                handler: 'openTagManager'
            },
            {
                width: 40,
                glyph: 0xf115,
                handler: 'openCategoriesManager'
            }
        ]
    },

    layout: 'card',

    items: [
        {
            xtype: 'grid',
            reference: 'grid',
            ui: 'paper',
            cls: 'material-grid large',
            // border: true,
            bind: {
                store: '{posts}'
            },
            margin: '20 20 10',
            listeners: {
                // select: 'onSelectItem',
                itemdblclick: 'editSelected'
            },

            bbar: {
                xtype: 'pagingtoolbar',
                displayInfo: true,
                bind: {
                    store: '{posts}'
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
                                text: 'Editar Título',
                                handler: 'editTitle'
                            },
                            {
                                text: 'Editar Publicação',
                                handler: 'editSelected'
                            },
                            {
                                text: 'Editar Tags',
                                handler: 'editPostTags'
                            },
                            {
                                text: 'Editar Categorias',
                                handler: 'editPostCategories'
                            },
                            '-',
                            {
                                text: 'Publicar',
                                bind: {
                                    hidden: '{grid.selection.is_published}',
                                    handler: 'togglePublished'
                                }
                            },
                            {
                                text: 'Despublicar',
                                bind: {
                                    hidden: '{!grid.selection.is_published}',
                                    handler: 'togglePublished'
                                }
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
                    xtype: 'widgetcolumn',
                    dataIndex: 'thumbnail_url',
                    width: 90,
                    text: 'Capa',
                    menuDisabled: true,
                    resizable: false,
                    draggable: false,
                    bind: {
                        hidden: '{blogConfig.disable_cover}'
                    },
                    widget: {
                        xtype: 'changeable-image',
                        density: 5,
                        defaultBindProperty: 'src',
                        bind: {
                            ratio: '{blogConfig.cover_ratio}'
                        },
                        listeners: {
                            change: 'onChangeCover'
                        }
                    }
                },
                {
                    xtype: 'gridcolumn',
                    width: 400,
                    dataIndex: 'title',
                    text: 'Título',
                    flex: 1,
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    draggable: false,
                    renderer: function(value, p, model) {

                        function a(html) { return '<a>'+html+'</a>'; }
                        function span(html) { return '<span>'+html+'</span>'; }
                        function icon(iconName, color, tip) {
                            return Ext.String.format('<i class="fa fa-{0} fa-fw" style="color:{1};" title="{2}"></i> ',
                                iconName,
                                color || 'inherit',
                                tip || '');
                        }

                        var format = Ext.String.format,
                            map = Ext.Array.map,
                            tpl = [
                                '<div class="title">{0} <div class="badges">{1}</div></div>',
                                '<div class="subinfo">{2} {3}</div>'
                            ].join(''),
                            tags = map(model.get('tags'), function(item) {
                                return a(item);
                            }).join(', '),
                            categories = map(model.get('categories'), function(item) {
                                return a(item);
                            }).join(', ');


                        return format(tpl,
                            // model.get('is_published') ? icon('toggle-on', 'Publicado') : icon('toggle-off', 'Rascunho'),
                            value,
                            (model.data.is_published ? '' : icon('pencil-square-o', '', 'Rascunho')),
                            span( (tags ? icon('tags') : icon('warning')) + (tags || '(sem tags)') ),
                            span( (categories ? icon('folder') : icon('warning')) + (categories || '(sem categorias)') )
                        );
                    }
                },
                {
                    xtype: 'datecolumn',
                    width: 200,
                    dataIndex: 'created_at',
                    text: 'Criado em',
                    format: 'd/m/Y',
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    draggable: false,
                    renderer: function(value, p, model) {
                        var author = model.get('author');
                        return Ext.String.format('<div>{0}</div><div class="subinfo">por {1}</div>',
                            Ext.Date.dateFormat(value, 'd/m/Y'),
                            author ? author.first_name : '');
                    }
                }
            ]

        }





    ]

});
