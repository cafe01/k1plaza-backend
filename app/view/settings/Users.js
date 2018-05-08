/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define("q1plaza.view.settings.Users", {
    extend: "Ext.panel.Panel",

    requires: [
        "q1plaza.view.settings.UsersController",
        "q1plaza.view.settings.UsersModel",
        "q1plaza.view.settings.GroupMembers"
    ],
    xtype: 'settings-users',
    controller: "settings-users",
    viewModel: {
        type: "settings-users"
    },

    cls: 'x-users-panel',
    glyph: 0xf0c0,
    // bodyPadding: 20,
    // ui: 'paper',
    tbar: {
        // padding: '20',
        defaults: {
            xtype: 'button',
            scale: 'large'
        },
        items: [{
                text: 'Novo Usuário',
                handler: 'createUser',
                ui: 'default'
            }
            // ' ',
            // {
            //     text: 'Editar',
            //     handler: 'editSelected',
            //     bind: {
            //         disabled: '{!tree.selection}'
            //     }
            // },
            // '-',
            // {
            //     text: 'Remover',
            //     handler: 'deleteSelected',
            //     bind: {
            //         disabled: '{!tree.selection}'
            //     }
            // }
        ]
    },
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
        bind: {
            store: '{users}'
        }
    },
    layout: 'border',
    items: [
        {
            xtype: 'grid',
            reference: 'grid',
            region: 'center',
            cls: 'material-grid large',
            bind: {
                store: '{users}'
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
                        glyph: 0xf0d7,
                        menu: [
                            {
                                text: 'Tornar Administrador',
                                handler: 'promoteAdmin'
                            },
                            // {
                            //     text: 'Editar Grupos',
                            //     handler: 'editUserRoles'
                            // },
                            '-',
                            {
                                text: 'Deletar',
                                handler: 'deleteSelected'
                            }
                        ]
                    }
                },
                {
                    text: 'Nome',
                    dataIndex: 'first_name',
                    flex: 1,
                    renderer: function(value, p, model) {
                        var fmt = Ext.String.format;
                        var img = Ext.String.format('<img src="{0}" width="50" height="50" style="float:left; margin:5px 15px 5px 0;"  />', model.get('icon'));
                        var roles = Ext.Array.map(model.get('roles'), function(r){ return r.rolename }).join(', ');
                        var badges = [];
                        if (model.get('google_id')) badges.push('<i class="fa fa-fw fa-google" title="Conectado com Google"></i>');
                        if (model.get('facebook_id')) badges.push('<i class="fa fa-fw fa-facebook" title="Conectado com Facebook"></i>');
                        if (model.hasRole('instance_admin')) badges.push('<i class="fa fa-fw fa-key" title="Administrador"></i>');
                        return img + fmt('<div>{0}</div><div class="subinfo">{1}</div>',
                            model.get('fullName') || '<div class="subinfo">(sem nome)</div>',
                            badges.join(' '));
                    }
                },

                {
                    text: 'Email',
                    dataIndex: 'email',
                    width: 200
                },

                {
                    text: 'Ultimo Login',
                    dataIndex: 'last_login_at',
                    width: 150,
                    renderer: function(value) {
                        return value ? Ext.String.format('<span title="{0}">{1}</span>', value.format('DD/MM/YYYY [às] HH:mm'), value.fromNow())
                                     : '<div class="subinfo">(login pendente)</div>';
                    }
                },

                {
                    text: 'Cadastrado em',
                    dataIndex: 'created_at',
                    width: 150,
                    renderer: function(value) {
                        return Ext.String.format('<span title="{0}">{1}</span>', value.format('DD/MM/YYYY [às] HH:mm'), value.calendar());
                    }
                }
            ],
            listeners: {
                itemcontextmenu: 'showItemContextMenu'
            }


        },

        // groups
        {
            xtype: 'settings-group-members',
            title: 'Administradores',
            reference: 'adminsPanel',
            region: 'east',
            split: true,
            width: 230
        }
    ]






});
