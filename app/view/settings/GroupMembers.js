/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define("q1plaza.view.settings.GroupMembers", {
    extend: "Ext.grid.Panel",

    requires: [
        "q1plaza.view.settings.GroupMembersController"
        // "q1plaza.view.settings.GroupMembersModel"
    ],
    xtype: 'settings-group-members',
    controller: "settings-group-members",
    // viewModel: {
    //     type: "settings-group-members"
    // },

    glyph: 0xf0c0,
    // bodyPadding: 20,
    // ui: 'paper',
    config: {
        groupRecord: null
    },
    cls: 'material-grid large',

    store: {
        model: 'User',
        proxy: {
            type: 'rest',
            url: '/.resource/role/instance_admin/members',
            autoSync: true,
            reader: {
                type: 'json',
                idProperty: 'id',
                rootProperty: 'items'
            }
        }
    },
    hideHeaders: true,
    allowDeselect: true,
    tools:[
        {
            type: 'refresh',
            handler: 'refresh'
        }
    ],
    columns: [
        {
            dataIndex: 'fullName',
            flex: 1,
            renderer: function(value, p, model) {
                return Ext.String.format('<div>{0}</div><div class="subinfo">{1}</div>',
                    model.get('fullName'),
                    model.get('email'));
            }
        }
    ],
    listeners: {
        itemcontextmenu: 'showItemContextMenu'
    }

});
