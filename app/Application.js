/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console, backendConfig, humane */

Ext.setGlyphFontFamily('FontAwesome');
Ext.tip.QuickTipManager.init();

Ext.Loader.setPath('Ext', '/.static/js/backend/ext/src');
Ext.Loader.setPath('backend', '/.static/js/backend');

window.backendConfig = backendConfig || {};

Ext.each(backendConfig.plugins || [], function(item){
    Ext.require('backend.plugin.'+item);
});

Ext.each(backendConfig.requires || [], function(item){
    Ext.require(item);
});

Ext.define('q1plaza.Application', {
    extend: 'Ext.app.Application',

    // investigate this "name" is the cause of the path error for 'q1plaza'
    name: 'q1plaza',

    requires: [
        "Ext.form.field.Text",
        "Ext.form.field.TextArea",
        "Ext.form.field.Number",
        "Ext.form.field.Date",
        "Ext.form.field.Time",
        "Ext.form.field.Checkbox",
        'q1plaza.view.main.Main',
        'q1plaza.view.main.Settings',
        'q1plaza.view.agenda.Agenda',
        'q1plaza.view.blog.Blog',
        'q1plaza.view.gallery.Gallery',
        'q1plaza.view.expo.Expo',
        'q1plaza.store.AppData'
    ],

    launch: function () {
        var me = this,
            stateProvider;

        // humane
        me.showMessage = humane.spawn({ timeout: 3000, waitForMove : false });
        me.showError   = humane.spawn({ addnCls: 'humane-flatty-error', timeout: 7000, waitForMove : true });

        // state provider
        try {
            stateProvider = Ext.create('Ext.state.LocalStorageProvider', { prefix: 'q1be2-' });
            Ext.state.Manager.setProvider(stateProvider);
        }
        catch(ignore) {}

        // app data
        me.appData = Ext.create('q1plaza.store.AppData', {
            model: 'Data',
            data: backendConfig.appData || []
        });

        delete backendConfig.appData;

        // init plugins
        Ext.each(backendConfig.plugins || [], function(name) {
            var plugin = Ext.createByAlias('app-plugin.' + name);
            plugin.init(me);
        });

        // init viewport
        me.viewport = Ext.widget('app-main', {
            viewModel: {
                data: {
                    config: backendConfig
                },
                stores: {
                    appData: me.appData
                }
            },
            listeners: {
                menuready: function(){
                    Ext.getBody().select('#loading-mask').fadeOut({ duration: 200, remove: true });
                }
            }
        });

        me.fireEvent('render', me, me.viewport);
    },

    getViewModel: function() {
        return this.viewport.getViewModel();
    },

    getToolbar: function() {
        return this.viewport.lookupReference('appToolbar');
    },

    uriForMedia: function(media, options) {
        options = options || {};

        if (Ext.isString(media)) {
            media = { uuid: media };
        }

        options.zoom = options.zoom || options.z;
        options.bgcolor = options.bgcolor || options.color;
        options.format = options.format || 'jpg';

        var url = '/.media/file/' + media.uuid,
            fill;

        if (options.scale) {
            url = url + '_' + options.scale;
        }

        if (Ext.isDefined(options.crop)) {
            url = url + '-crop';
        }

        if (Ext.isDefined(options.fill)) {
            fill = options.fill ? '-fill0x' + options.fill : '-fill';
            url = url + fill;
        }

        url = url + '.' + options.format;

        return url;

    },

    generateFormFields: function(schema) {
        var fields = [],
            fieldMap;

        fieldMap = {
            string : 'textfield',
            int : 'numberfield',
            float : 'numberfield',
            boolean : 'checkbox',
            text : 'textareafield',
            html : 'htmleditor'
        };

        Ext.Object.each(schema, function(name, datatype){
            var config = {},
                field,
                xtype;

            if (typeof datatype === 'object') {
                config = datatype;
                datatype = config.data_type;
            }

            xtype = fieldMap[datatype];

            if (typeof config.renderer === 'string') {
                xtype = config.renderer;
            }

            config.position = parseInt(config.position, 10);

            field = {
                xtype: xtype,
                name: name,
                fieldLabel: config.label || name,
                position: Ext.isNumber(config.position) ? config.position : 2
            };

            if (typeof config.renderer === 'object') {
                Ext.apply(field, config.renderer);
            }

            if (!field.xtype) {
                console.error("Can't find xtype for field: ", arguments);
                return;
            }

            //console.log('new dynamic form field', field);
            fields.push(field);
        });

        // sort by posotion
        fields.sort(function(a, b){
            return a.position - b.position;
        });

        return fields;
    }
});
