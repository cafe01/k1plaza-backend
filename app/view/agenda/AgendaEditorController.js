/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define('q1plaza.view.agenda.AgendaEditorController', {
    extend: 'q1plaza.base.ViewController',
    alias: 'controller.agenda-agendaeditor',

    onAfterRender: function() {
        var me = this;
        me.lookupReference('titleField').bodyEl.on('click', me.promptTitle, me);
    },

    promptTitle: function() {
        var me = this,
            record = me.getViewModel().get('record');

        Ext.Msg.prompt('Alterar nome do evento', '', function(btn, value){

            if (btn !== 'ok' || !value.match(/\w+/)) { return; }
            record.set('title', value);

        }, me, false, record.get('title')).setWidth(400).center();
    },

    onPublishClick: function(button) {
        var me = this,
            record = me.getViewModel().get('record');

        record.set('is_published', button.value);
        me.getView().closeOnSave = true;
        me.onSaveClick();
    },

    onSaveClick: function() {
        var me = this,
            record = me.getViewModel().get('record');

        record.save({
            success: function(record, operation) {
                me.fireViewEvent('save', record, operation);
                // console.log('saved', record.get('id'));
            },
            failure: function() {
                me.showError();
            }
        });
    },

    onCloseClick: function() {
        var me = this,
            view = me.getView(),
            record = view.record;

        if (!record.dirty) {
            view.close();
            return;
        }

        Ext.MessageBox.confirm('Confirmação', 'Existem alterações não salvas. Deseja descartar?', function(btn){
            if (btn !== 'yes') { return; }
            record.reject();
            view.close();
        });
    }



});
