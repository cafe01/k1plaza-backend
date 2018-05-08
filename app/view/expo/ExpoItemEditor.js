/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console, Q1Plaza  */

Ext.define("q1plaza.view.expo.ExpoItemEditor",{
    extend: "Ext.window.Window",

    requires: [
        "Ext.form.Panel"
    ],

    xtype: 'expoItemEditor',

    width: 500,
    height: 600,
    modal: true,
    maximizable: true,
    title: 'Editar',
    glyph: 0xf044,

    config: {
        enableTags: false,
        metadata: null,
        widgetName: null
    },

    layout: 'anchor',

    items: {
        xtype: 'form',
        trackResetOnLoad: true,
        anchor: '100% 100%',
        layout: 'anchor',
        bodyPadding: 20,
        defaults: {
            anchor: '100%'
        },
        bbar: {
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            defaults: {
                width: 120,
                scale: 'large'
            },
            items: [
                {
                    text: 'Salvar',
                    handler: 'onSaveClick',
                    ui: 'default',
                    formBind: true
                },

                {
                    text: 'Cancelar',
                    handler: 'onCancelClick'
                }
            ]
        }
    },

    listeners: {
        afterrender: 'initFields',
        scope: 'this'
    },

    initFields: function() {
        var me = this,
            fields = Q1Plaza.app.generateFormFields(me.getMetadata()),
            form;

        // console.log('initFields', me, me.rendered, fields);
        if (!me.rendered) { return; }

        form = me.child('form');
        if (!form) { return; }

        if ( me.getEnableTags() ) {
            // console.log('tags is enabled!');
            fields.unshift({
                xtype: 'tagfield',
                cls: 'material',
                name: 'tags',
                fieldLabel: 'Tags',
                fieldStyle: {
                    padding: 5
                },
                grow: true,
                // growMin: 80,
                growMax: 200,
                displayField: 'name',
                valueField: 'name',
                filterPickList: true,
                forceSelection: false,
                createNewOnEnter: true,
                createNewOnBlur: true,
                hideTrigger: true,
                triggerOnClick: false,
                triggerAction: 'query',
                queryMode: 'local',
                minChars: 4,
                store: {
                    model: 'Tag',
                    pageSize: 500,
                    autoLoad: {
                        params: { widget: me.getWidgetName() }
                    }

                }
            });
        }

        fields.unshift({
            xtype: 'textfield',
            fieldLabel: 'Título',
            allowBlank: false,
            name : 'title'
        });

        // form.removeAll();
        form.add(fields);
    },

    loadRecord: function(record) {
        var me = this;
        if (!me.rendered) { return; }
        return me.child('form').loadRecord(record);
    },

    onSaveClick: function() {
        var me = this,
            form = me.child('form'),
            record = form.getRecord();

        // console.log('onSaveClick', form);

        if (!form.isDirty()) {
            me.fireEvent('cancel');
            me.close();
            return;
        }

        record.set(form.getValues(false, true));
        // form.updateRecord(record);
        // console.log('saving rec', record);

        record.save({
            success: function() {
                me.fireEvent('savesuccess', me, record);
                me.close();
            },
            failure: function() {
                me.fireEvent('savefailure', me, record);
            }
        });

    },

    onCancelClick: function() {
        var me = this,
            form = me.child('form');

        if (!form.isDirty()) {
            me.fireEvent('cancel');
            me.close();
            return;
        }

        Ext.MessageBox.confirm('Confirmação', 'Existem alterações não salvas. Deseja descartar?', function(btn){
            if (btn !== 'yes') { return; }
            me.fireEvent('cancel');
            me.close();
        });
    }

});
