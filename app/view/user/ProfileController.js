/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console  */

Ext.define('q1plaza.view.user.ProfileController', {
    extend: 'q1plaza.base.ViewController',
    alias: 'controller.user-profile',

    // init: function() {
    //     var me = this,
    //         vm = me.getViewModel();
    //
    //     vm.bind('{loggedInUser}', function(rec){
    //         if (!rec) {
    //             return;
    //         }
    //         console.log('loggedInUser', rec);
    //         vm.set('record', rec.clone());
    //     }, { single: true });
    // },

    onSaveClick: function(button) {
        var me = this,
            view = me.getView(),
            record = me.getViewModel().get('loggedInUser');

        view.setLoading(true);
        record.save({
            success: function(record, operation) {
                view.setLoading(false);

                me.fireViewEvent('save', record, operation);
                console.log('saved user', record.get('id'));

                view.ownerCt.prev();
                view.close();
            },

            failure: function() {
                view.setLoading(false);
                me.showError('Erro de comunicação com o servidor.');
            }
        });
    },

    onCloseClick: function() {
        var me = this,
            view = me.getView(),
            record = me.getViewModel().get('loggedInUser');

        if (!record.dirty) {
            view.close();
            return;
        }

        Ext.Msg.confirm('Confirmação', 'Existem alterações não salvas. Deseja descartar?', function(btn){
            if (btn !== 'yes') { return; }
            record.reject();
            view.close();
        });
    }

});
