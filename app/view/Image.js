/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, console, Q1Plaza */

Ext.define("q1plaza.view.Image",{
    extend: "Ext.Component",

    requires: ['Ext.form.Labelable'],
    mixins: {
        labelable: 'Ext.form.Labelable'
    },

    xtype: "changeable-image",
    cls: 'x-changeable-image',
    autoEl: 'div',

    config: {
        src: null,
        ratio: null,
        density: 1,
        progress: 0
    },

    listeners: {
        scope: 'this',
        afterrender: 'onAfterRender',
        boxready: 'onBoxReady',
        resize: {
            fn: 'onResize',
            buffer: 50
        }
    },

    publishes: ['src'],
    twoWayBindable: ['src'],
    defaultBindProperty: 'src',

    initComponent: function() {
        var me = this;
        me.initLabelable();
        me.callParent();
    },

    getElConfig: function() {
        var me = this,
            config = me.callParent(arguments),
            src = me.initialConfig.src,
            uploadIcon = me.initialConfig.uploadIcon || 'upload';

        if (!src) {
            config.cls = 'x-changeable-image empty';
        }

        config.cn = [{
            tag: 'div',
            cls: 'wrapper',
            cn: [
                {
                    tag: 'img',
                    src: Ext.BLANK_IMAGE_URL,
                    id: me.id + '-img'
                },
                {
                    tag: 'div',
                    cls: 'overlay',
                    cn: [{ tag: 'i', cls: 'fa fa-' + uploadIcon }]
                },
                {
                    tag: 'progress',
                    value: 0,
                    min: 0,
                    max: 100,
                    style: {
                        display: 'none',
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: '100%'
                    }
                }
            ]
        }];
        // console.log('elConfig', config);
        return config;
    },

    onBoxReady: function() {
        var me = this,
            src = me.initialConfig.src,
            ratio = me.initialConfig.ratio;

        if (ratio) {
            // console.log('onBoxReady', me.getRatio(), me.getWidth(), me.getHeight());
            me.setRatio(ratio);
        }

        if (src) {
            me.setSrc(src);
        }
    },

    onResize: function() {
        var me = this,
            src = me.originalSrc || me.initialConfig.src;
        // console.log('resized');
        if (!src) {
            return;
        }

        if (me.rendered && me.getRatio()) {
            me.setHeight(me.getWidth() / me.getRatio());
        }

        me.setSrc(src);
    },

    onAfterRender: function() {
        var me = this;
        me.imgEl = me.el.select('img').first();
        me.el.on('click', me.onClick, me);
        me.setSrc(me.getSrc());
    },

    onClick: function() {
        var me = this;

        // if (me.windowIsOpen) {
        //     return;
        // }

        me.windowIsOpen = true;
        if (!me.fileInput) {

            me.fileInput = Ext.DomHelper.append(Ext.getBody(), '<input type="file" name="file"/>');

            me.fileInput.onchange = function() {
                me.uploadFile(me.fileInput.files[0]);
            };
        }
        me.fileInput.value = null;
        me.fileInput.click();
    },

    uploadFile: function(file) {
        var me = this,
            form = new FormData(),
            xhr = new XMLHttpRequest(),
            url = '/.media';

        // add file
        form.append('file', file);

        function onError() {
            // console.error('upload error', arguments);
        }

        // errors
        xhr.onabort = onError;
        xhr.onerror = onError;


        // success
        xhr.onload = function(e) {

            // error actually
            if (xhr.status >= 300 || xhr.status < 200) {
                onError();
                return;
            }

            var newMedia = Ext.decode(xhr.responseText),
                src = Q1Plaza.app.uriForMedia(newMedia);
            // console.log('new media', newMedia);
            me.setSrc(src);
            me.fireEvent('change', me, src, newMedia);
            me.setProgress(0);

        };


        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var progressPercent = Math.ceil(e.loaded / e.total * 100);
                me.setProgress(progressPercent);
            }
        }

        // send
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(form);
    },

    setSrc: function(src) {
        var me = this,
            publishValue = src,
            density = me.getDensity(),
            match;

        // console.log('setSrc', src);

        if (!me.imgEl) {
            return;
        }

        if (!src) {
            me.el.addCls('empty');
            return;
        }
        me.el.removeCls('empty');

        if (me.getWidth() == 0) {
            setTimeout(function(){
                me.setSrc(src);
            }, 500);
            return;
        }

        me.el.removeCls('empty');
        me.originalSrc = src;

        // media file url, like http://localhost:5000/.media/file/73256688190011e5b36cddeccf475ee5.jpg
        match = src.match(/\/\.media\/file\/(\w{32})\.\w+$/);
        if (match) {
            publishValue = match[0];
            src = Q1Plaza.app.uriForMedia(match[1], {
                scale: me.getWidth()*density +'x'+ me.getHeight()*density,
                crop: 1
            });
        }

        me.publishState('src', publishValue);
        me.imgEl.dom.src = src;
    },

    applyRatio: function(ratio) {
        var me = this;
        if (!me.rendered) {
            return;
        }
        me.setHeight(me.getWidth() / ratio);
    },

    applyProgress: function(value) {
        var me = this,
            el = me.el,
            progressEl;

        if (el) {
            progressEl = el.down('progress');
            progressEl.setVisible(value > 0);
            progressEl.dom.value = value;
        }
    }

});
