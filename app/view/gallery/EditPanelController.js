/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define('q1plaza.view.gallery.EditPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.gallery-editpanel',

    onDirtyChange: function(form, isDirty) {
        var me = this;
        me.getViewModel().set('dirty', isDirty);
    },

    onSaveClick: function() {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            editor = me.lookupReference('editor'),
            record = vm.get('record');

        view.setLoading(true);
        record.set(editor.getValues());

        record.save({
            callback: function(rec, operation, success) {

                view.setLoading(false);

                if (success) {
                    view.setRecord(record);
                    me.fireViewEvent('save');
                }
            }
        });
    },

    onCloseClick: function() {
        var me = this,
            editor = me.lookupReference('editor');

        if (!editor.isDirty()) {
            me.fireViewEvent('cancel');
            return;
        }

        Ext.MessageBox.confirm('Confirmação', 'Existem alterações não salvas. Deseja descartar?', function(btn){
            if (btn !== 'yes') { return; }
            me.fireViewEvent('cancel');
        });
    }

});
