/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console*/

Ext.define('q1plaza.view.agenda.AgendaController', {
    extend: 'q1plaza.base.ViewController',
    alias: 'controller.agenda',
    requires: [
        'Ext.window.MessageBox',
        'q1plaza.view.agenda.AgendaEditor'
    ],

    init: function() {
        'use strict';
        var me = this,
            view = me.getView(),
            store = me.getStore('agendaItems');

        store.getProxy().setUrl('/.widget/' + view.widgetRecord.get('name'));
        store.load();
    },

    onSelectItem: function (grid, record) {
        'use strict';
        this.getViewModel().set('currentRecord', record);
    },

    onAddClick: function () {
        'use strict';
        var me = this,
            record = Ext.create('q1plaza.model.Agenda', { title: 'Novo evento', date: new Date() });

        me.editRecord(record);
    },

    onEditClick: function () {
        'use strict';
        var me = this,
            vm = me.getViewModel(),
            record = vm.get('currentRecord');

        me.editRecord(record);
    },

    editRecord: function(record) {
        'use strict';
        var me = this,
            view = me.getView(),
            grid = view.lookupReference('grid'),
            main = me.getViewModel().get('main'),
            editor = main.openWidget('agendaeditor-' + record.get('id'), 'agendaEditor', {
                title: record.get('title')
            });

        // the binding dont work when passing on constructors
        editor.setRecord(record);

        editor.on('save', function(record){

            me.showMessage();

            // created
            if (!record.store) {
                me.getStore('agendaItems').addSorted(record);
                grid.getSelectionModel().select(record);
            }

            if (editor.closeOnSave) {
                editor.close();
            }
        });

        editor.on('close', function() {
            main.setActiveItem(view);
        });

        return editor;
    },

    onDeleteClick: function () {
        'use strict';
        var me = this,
            vm = me.getViewModel(),
            record = vm.get('currentRecord'),
            title = record.get('title'),
            message = Ext.String.format('Deletar o evento <b style="font-weight:500">"{0}"</b>?', title);

        Ext.MessageBox.confirm('Confirmação', message, function(btn){
            if (btn !== 'yes') { return; }
            record.erase();
            vm.set('currentRecord', null);
            me.showMessage(Ext.String.format('Evento <b style="font-weight:500">"{0}"</b> deletado.', title));
        });
    },

    onPublishToggle: function(btn) {
        var me = this,
            vm = me.getViewModel(),
            record = vm.get('currentRecord');

        record.set('is_published', btn.value);
        record.save();
        me.showMessage();
    },

    onPeriodClick: function(segButton, button) {
        'use strict';
        var me = this,
            store = me.getStore('agendaItems');

        store.getProxy().setExtraParam('period', button.value);
        store.load();
    }

});
