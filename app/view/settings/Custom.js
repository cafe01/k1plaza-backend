/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console  */

Ext.define("q1plaza.view.settings.Custom",{
    extend: "Ext.panel.Panel",

    requires: [
        "q1plaza.view.settings.CustomController",
        "q1plaza.view.settings.CustomModel"
    ],
    xtype: 'settings-custom',
    controller: "settings-custom",
    viewModel: {
        type: "settings-custom"
    },

    title: 'Configurações do site',
    glyph: 0xf085,

    listeners: {
        render: 'onRender'
    },

    tbar: {
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
            }
        ]
    },
    layout: 'fit',
    items: {
        xtype: 'form',
        reference: 'form',
        margin: 20,
        layout: 'anchor',
        defaults: {
            labelAlign: 'top',
            anchor: '40%'
        },
        listeners: {
            dirtychange: 'onDirtyChange'
        },
        items:[
            {
                xtype: 'box',
                anchor: '100%',
                html: [
                    '<h1><i class="fa fa-cogs"></i> Configurações</h1>'
                    // '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>'
                ].join('')
            }
        ]
    }
});
