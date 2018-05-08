/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console  */

Ext.define("q1plaza.view.user.Profile",{
    extend: "Ext.panel.Panel",

    requires: [
        "q1plaza.view.user.ProfileController",
        "q1plaza.view.user.ProfileModel"
    ],
    xtype: 'user-profile',
    controller: "user-profile",
    viewModel: {
        type: "user-profile"
    },

    title: 'Menu Perfil',
    glyph: 0xf007,

    tbar: {
        padding: 12,
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

    bodyPadding: 25,
    bodyBorder: true,
    bodyStyle: {
        borderTop: '1px solid #ddd'
    },

    layout: 'column',
    items: [
        {
            width: 200,
            title: 'Avatar',
            items: {
                xtype: 'changeable-image',
                bind: {
                    src: '{loggedInUser.image_url}'
                },
                width: '100%',
                ratio: 1
            }
        },
        {
            columnWidth: 1,
            margin: '0 0 0 20',
            defaults: {
                xtype: 'textfield',
                labelAlign: 'top'
            },
            title: 'Detalhes',
            items: [
                {
                    fieldLabel: 'Nome',
                    bind: '{loggedInUser.first_name}'
                },
                {
                    fieldLabel: 'Sobrenome',
                    bind: '{loggedInUser.last_name}'
                }
            ]
        }
    ]


});
