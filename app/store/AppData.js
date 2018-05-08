/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console */

Ext.define('q1plaza.store.AppData', {
    extend: 'Ext.data.Store',
    requires: ['q1plaza.model.Data'],
    model: 'q1plaza.model.Data',

    proxy: {
        type: 'rest',
        url: '/.resource/data'
    },

    get: function(name) {
        var rec = this.findRecord('name', name);
        if (rec) {
            return rec.get('value');
        }
    },

    set: function(key, value) {
        var me = this,
            Data = me.getModel(),
            data;

        if (Ext.isObject(key)) {
            data = key;
        }
        else {
            data = {};
            data[key] = value;
        }

        Ext.Object.each(data, function(name, val){
            var record = me.findRecord('name', name);
            console.log('set', name, val);

            if (record) {
                record.set('value', val);
            }
            else {
                record = new Data({ name: name });
                record.set('value', val);
                me.add(record);
            }
            // record.save();
        });
    }
});
