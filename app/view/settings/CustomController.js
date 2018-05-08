/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console  */
Ext.define('q1plaza.view.settings.CustomController', {
    extend: 'q1plaza.base.ViewController',
    alias: 'controller.settings-custom',

    onRender: function(view) {
        var me = this,
            appData = me.getViewModel().get('appData'),
            schema = me.getViewModel().get('config').config_schema || [],
            fields = [],
            types;

        // console.log(schema);

        types = {
            number: 'numberfield',
            text: 'textareafield',
            date: 'datefield',
            time: 'timefield'
        };

        schema.forEach(function(item){
            var xtype = types[item.type] || 'textfield',
                field = {
                    xtype: xtype,
                    fieldLabel: item.label || item.name.toUpperCase(),
                    anchor: item.type === "text" ? '60%' : '40%',
                    value: appData.get(item.name)
                };

            Ext.applyIf(field, item);

            fields.push(field);
        });

        me.lookupReference('form').add(fields);
    },

    onDirtyChange: function(form, isDirty) {
        this.getViewModel().set('dirty', isDirty);
    },

    onSaveClick: function() {
        var me = this,
            view = me.getView(),
            form = me.lookupReference('form'),
            appData = me.getViewModel().get('appData');

        // console.log('saveClick', view.getValues());
        view.setLoading(true);
        appData.set(form.getValues());
        appData.sync({
            success: function() {
                view.setLoading(false);
                me.showMessage();
                view.close();
            },

            failure: function() {
                view.setLoading(false);
                me.showError();
            }
        });
    },

    onCloseClick: function() {
        var me = this,
            view = me.getView();

        if (!me.getVM().get('dirty')) {
            view.close();
            return;
        }

        Ext.MessageBox.confirm('Confirmação', 'Existem alterações não salvas. Deseja descartar?', function(btn){
            if (btn !== 'yes') { return; }
            view.close();
        });
    }

});
