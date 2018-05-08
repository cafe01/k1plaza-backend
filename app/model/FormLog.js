/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, console*/

Ext.define('q1plaza.model.FormLog', {
    extend: 'q1plaza.model.Base',

    fields: [
        'form_name',
        {
            name: 'created_at',
            type: 'date',
            dateFormat: "Y-m-d H:i:s"
        },
        {
            name: 'data',
            type: 'auto',
            convert: function(value) {
                console.log('form log data', value);
                return value;
            }
        }
    ],

    proxy: {
        url: '/.resource/formlog'
    }
});
