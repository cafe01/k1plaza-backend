Ext.define('q1plaza.view.agenda.AgendaModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.agenda',

    requires: ['q1plaza.model.Agenda'],

    data: {
        currentRecord: null
    },

    stores: {
        agendaItems: {
            model: 'Agenda'
        }
    }

});
