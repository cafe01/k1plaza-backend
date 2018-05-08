/*jslint white:true, unparam: true, sloppy: true, browser: true*/
/*global Ext, console, FormData, XMLHttpRequest */

Ext.define('q1plaza.form.RichEditor', {
    extend: 'Ext.form.field.HtmlEditor',
    requires: [
    ],

    xtype: 'richeditor',

    enableFont: false,
    enableColors: false,

    config: {
        editorStyle: null
    },

    listeners: {
        initialize: 'onInitialize',
        scope: 'this'
    },

    onInitialize: function() {
        var me = this,
            editorBody = me.getEditorBody(),
            doc = Ext.get(me.getDoc()),
            dom = Ext.DomHelper,
            style = Ext.apply({}, me.getEditorStyle() || {}, {
                maxWidth: '660px',
                margin: '0 20px',
                padding: '20px 0',
                lineHeight: 1.8,
                fontSize: '17px',
                fontFamily: "'Noto Serif', serif'"
            });

        dom.applyStyles(editorBody, style);
        dom.append(doc.selectNode('head'), {
            tag: 'link',
            rel: 'stylesheet',
            type: 'text/css',
            href: 'http://fonts.googleapis.com/css?family=Noto+Serif:400,700,400italic,700italic'
        });
    },

    createToolbar: function(){
        var me = this,
            toolbar = me.callParent(arguments);

        me.imageBtn = Ext.widget({
            xtype: 'button',
            glyph: 0xf03e,
            overflowText: 'Inserir imagens',
            handler: me.showUploadDialog,
            disabled: true,
            scope: me
        });

        me.clearFormatBtn = Ext.widget({
            xtype: 'button',
            glyph: 0xf12d,
            overflowText: 'Limpar formatação',
            handler: me.clearFormat,
            disabled: true,
            scope: me
        });

        // console.log('toolbar', toolbar);
        toolbar.add([{ xtype: 'tbseparator' }, me.imageBtn, me.clearFormatBtn]);

        return toolbar;
    },

    updateToolbar: function() {
        var me = this,
            doc = me.getDoc();

        me.callParent(arguments);
        // console.log('enable btn', doc.queryCommandEnabled('insertimage'));
        me.imageBtn.setDisabled(!doc.queryCommandEnabled('insertImage'));
        me.clearFormatBtn.setDisabled(!doc.queryCommandEnabled('removeFormat'));
    },

    clearFormat: function() {
        var me = this,
            doc = me.getDoc(),
            selection = doc.getSelection(),
            range = selection.getRangeAt(0),
            fragment = range.extractContents(),
            div;

        // Ext.each(fragment.querySelectorAll('*[style], *[id], *[class], *[role]'), function(node){
        //     node.removeAttribute('style');
        //     node.removeAttribute('id');
        //     node.removeAttribute('class');
        //     node.removeAttribute('role');
        // });

        // console.log(selection, range, fragment);

        // range.insertNode(fragment);
        div = doc.createElement('div');
        div.appendChild(fragment);
        me.relayCmd('insertHTML', me.fixHtmlPaste(div.innerHTML));
    },

    fixHtmlPaste: function(html) {

        var removals = [/&nbsp;/ig, /[\r\n]/g, /<(xml|style)[^>]*>.*?<\/\1>/ig, /<\/?(meta|object|span)[^>]*>/ig,
			/<\/?[A-Z0-9]*:[A-Z]*[^>]*>/ig, /(lang|class|type|name|title|id|clear)=\"[^\"]*\"/ig, /style=(\'\'|\"\")/ig, /<![\[-].*?-*>/g,
			/MsoNormal/g, /<\\?\?xml[^>]*>/g, /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /&nbsp;/g,
            /<\/?SPAN[^>]*>/g, /<\/?FONT[^>]*>/g, /<\/?STRONG[^>]*>/g, /<\/?H1[^>]*>/g, /<\/?H2[^>]*>/g, /<\/?H3[^>]*>/g, /<\/?H4[^>]*>/g,
            /<\/?H5[^>]*>/g, /<\/?H6[^>]*>/g, /<\/?P[^>]*><\/P>/g, /<!--(.*)-->/g, /<!--(.*)>/g, /<!(.*)-->/g, /<\\?\?xml[^>]*>/g,
            /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /style=\"[^\"]*\"/g, /style=\'[^\"]*\'/g, /lang=\"[^\"]*\"/g,
            /lang=\'[^\"]*\'/g, /class=\"[^\"]*\"/g, /class=\'[^\"]*\'/g, /type=\"[^\"]*\"/g, /type=\'[^\"]*\'/g, /href=\'#[^\"]*\'/g,
            /href=\"#[^\"]*\"/g, /name=\"[^\"]*\"/g, /name=\'[^\"]*\'/g, / clear=\"all\"/g, /id=\"[^\"]*\"/g, /title=\"[^\"]*\"/g,
            /<span[^>]*>/g, /<\/?span[^>]*>/g, /<title>(.*)<\/title>/g, /class=/g, /<meta[^>]*>/g, /<link[^>]*>/g, /<style>(.*)<\/style>/g,
            /<w:[^>]*>(.*)<\/w:[^>]*>/g];

        Ext.each(removals, function(s){
            html = html.replace(s, "");
        });

        // keep the divs in paragraphs
        html = html.replace(/<div[^>]*>/g, "<p>");
        html = html.replace(/<\/?div[^>]*>/g, "</p>");
        return html;

    },

    insertImagePlaceholder: function() {
        var me = this,
            doc = me.getDoc(),
            src = 'http://placehold.it/200?text=Enviando',
            id = Ext.id();

        me.insertAtCursor('<img id="'+id+'" src="'+src+'" style="max-width:100%"  width="100%" height="100" /> ');
        return doc.getElementById(id);
    },

    showUploadDialog: function(btn) {
        var me = this,
            dh = Ext.DomHelper,
            fileInput = dh.append(Ext.getBody(), '<input type="file" name="file" multiple/>');

        fileInput.onchange = function() {
            // me.sendFiles(fileInput.files);
            // console.log('files selected', fileInput.files);
            // me.setLoading(true);
            // btn.setText('Enviando: ' + fileInput.files.length);
            Ext.Array.each(fileInput.files, function(file){
                var placeholder = me.insertImagePlaceholder();
                me.uploadFile(file, placeholder);
            });
        };

        fileInput.click();
    },

    uploadFile: function(file, imgEl) {
        var me = this,
            form = new FormData(),
            xhr = new XMLHttpRequest(),
            url = '/.media';

        // add file
        form.append('file', file);

        // Ext.Object.each(params || {}, function(key, val){
        //     form.append(key, val);
        // });

        // success
        xhr.onload = function(e) {

            // error actually
            if (xhr.status >= 300 || xhr.status < 200) {
                console.error('upload error');
                return;
            }

            var media = Ext.decode(xhr.responseText),
                img = Ext.fly(imgEl);
            // console.log('uploadsuccess', media);
            img.set({
                src: '/.media/file/'+media.uuid+'.jpg',
                id: false,
                height: '',
                width: ''
            });

            me.syncValue();
        };

        // error
        xhr.onerror = function(e) {
            console.error('upload error');
        };

        // abort
        xhr.onabort = function(e) {
            console.log('uploadabort');
        };

        // send
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(form);
    },

    insertFigure: function(config) {
        var me = this;
        // console.log('inserting figure', config);
        me.insertAtCursor('<img src="'+config.src+'" width="'+config.width+'" /> ');
    }


});
