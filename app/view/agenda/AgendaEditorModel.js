/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console */

Ext.define('q1plaza.view.agenda.AgendaEditorModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.agenda-agendaeditor',
    data: {
        record: null
    },

    formulas: {
        dirty: {
            bind: {
                bindTo: '{record}',
                deep: true
            },
            get: function(data){
                return data ? data.dirty : false;
            }
        },
        eventTime: {
            bind: '{record.date}',
            get: function(date){
                return date;
            },
            set: function(value){
                var record = this.get('record'),
                    date = new Date(record.get('date').getTime());

                date.setHours(value.getHours());
                date.setMinutes(value.getMinutes());
                date.setSeconds(0);
                record.set('date', date);
            }
        },
        eventDate: {
            bind: '{record.date}',
            get: function(date){
                return date;
            },
            set: function(value){
                var record = this.get('record'),
                    date = new Date(record.get('date').getTime());

                date.setFullYear(value.getFullYear());
                date.setMonth(value.getMonth(), value.getDate());
                record.set('date', date); // new object to trigger dirtyness
            }
        }
    }

});
