/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define('q1plaza.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        "Ext.toolbar.Spacer",
        "Ext.button.Segmented",
        "Ext.plugin.Viewport",
        "Ext.layout.container.Border",
        "Ext.layout.container.Card",
        'q1plaza.plugin.DeleteDrop',
        'q1plaza.view.main.MainController',
        'q1plaza.view.main.MainModel',
        'q1plaza.view.system.FormLog',
        "q1plaza.view.analytics.Analytics",
        "q1plaza.view.medias.Medias"
    ],

    xtype: 'app-main',
    plugins: [{
            ptype: 'viewport'
        }
        // { ptype: 'deletedrop', dropEl: 'mainLogo' }
    ],
    controller: 'main',
    viewModel: {
        type: 'main'
    },
    publishes: ['centerPanel'],

    layout: {
        type: 'border'
    },

    menuItems: [
    {
        separator: true
    },
    {
        title: 'Midias <sup><small>NEW</small></sup>',
        icon: 'picture-o',
        view: 'medias'
    },
    {
        title: 'Configurações <sup><small>NEW</small></sup>',
        icon: 'cogs',
        view: 'main-settings'
    },
    // {
    //     title: 'Analytics',
    //     icon: 'line-chart',
    //     view: 'analytics'
    // },
    {
        title: 'Abrir Website',
        icon: 'external-link',
        href: '/'
    },
    {
        title: 'Sair',
        icon: 'power-off',
        handler: 'onLogoutClick'
    }],

    items: [{
            region: 'west',
            xtype: 'container',
            width: 220,
            border: '0 1 0 0',
            collapsible: true,
            cls: 'x-main-menu x-unselectable',
            style: {
                borderColor: '#777',
                borderStyle: 'solid'
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                    xtype: 'box',
                    height: 100,
                    cls: 'x-main-logo',
                    reference: 'mainLogo',
                    style: {
                        backgroundColor: '#282a2e'
                    }
                },
                {
                    xtype: 'box',
                    // hidden: true,
                    cls: 'x-main-userpanel',
                    bind: {
                        data: {
                            user: '{loggedInUser}',
                            websiteName: '{config.name}'
                        }

                    },
                    tpl: [
                        '<div>',
                            '<img class="avatar" src="{user.data.icon}" />',
                                '<div class="info">',
                                '<div class="name">{websiteName}</div>',
                                '<div class="subinfo">{[ values.user.data.fullName || "Administrador" ]}</div>',
                            '</div>',
                        '</div>'
                    ]

                },
                {
                    xtype: 'component',
                    reference: 'mainMenu',
                    flex: 1,
                    scrollable: 'y',
                    bind: {
                        data: {
                            bindTo: '{menuItems}',
                            deep: true
                        }
                    },
                    tpl: new Ext.XTemplate(
                        // '<div id="{id}-body">',
                        '<tpl for=".">',
                            '<tpl if="data.separator">',
                                '<div class="separator"></div>',
                            '</tpl>',
                            '<tpl if="data.title">',
                                '<div class="menu-item {[ values.data.cls || "" ]} {[ values.data.active === true ? "active" : "" ]} {[ values.data.isGroup ? "group-item" : "" ]}" data-item-id="{id}">',
                                    '<i class="fa fa-{[ this.getIcon(values) ]}"></i>',
                                    '{data.title}',
                                '</div>',
                                // '<tpl for="data.items">',
                                //     '<div class="menu-item sub-item {[ values.data.active === true ? "active" : "" ]}" data-item-id="{id}">',
                                //         '<i class="fa fa-{[ this.getIcon(values) ]}"></i>',
                                //         '{data.title}',
                                //     '</div>',
                                // '</tpl>',
                            '</tpl>',
                        '</tpl>', {
                            getIcon: function(values) {
                                var xtype = values.data.view,
                                    icons = {
                                        blogEditor: 'quote-left',
                                        mediaGallery: 'image',
                                        agenda: 'calendar',
                                        expoEditor: 'th-list'
                                    };

                                // console.log('menu', );

                                return values.data.icon || icons[xtype] || 'cube';
                            }
                        }

                    ),
                    listeners: {
                        click: 'onMenuItemClick',
                        element: 'el',
                        delegate: '.menu-item, .sub-item'
                    }
                }
            ]
        },

        {
            region: 'center',
            xtype: 'container',
            itemId: 'centerPanel',
            cls: 'x-center-panel',
            reference: 'centerPanel',
            layout: 'card',
            items: [
                // {
                //     xtype: 'richeditor'
                // }
            ],
            listeners: {
                beforeadd: 'onBeforeAddPanel'
            }
        }
    ]
});
