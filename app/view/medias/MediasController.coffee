# coffeelint: disable=indentation,max_line_length
# out: ./$1.js
Ext.define 'q1plaza.view.medias.MediasController',

    extend: 'q1plaza.base.ViewController'
    requires: ['q1plaza.model.Media']
    alias: 'controller.medias'

    init: ->
        vm = @getViewModel()
        store = @getStore('medias')
        store.load()

    deleteSelected: ->
        grid = @lookupReference 'grid'
        records = grid.getSelection()
        store = @getStore('medias')
        msg = 'Deletar o arquivo selecionado?'
        if records.length > 1
            msg = Ext.String.format('Deletar os <strong>{0} arquivos</strong> selecionados?', records.length)

        Ext.MessageBox.confirm 'Confirmação', msg, (btn) =>
            return unless btn == 'yes'
            store.remove(records)
            store.sync()
            @showMessage('OK')

    renameSelected: ->
        record = @vmGet('grid.selection')
        callback = (btn, value) =>
            return unless btn == 'ok' and value.match(/\w/)
            console.log 'newname', value
            record.set('file_name', value)
            record.save()

        Ext.MessageBox.prompt 'Renomear', 'Novo nome:', callback, null, null, record.get('file_name'),

    viewSelected: ->
        data = @vmGet('grid.selection').data
        window.open data.url, data.uuid

    downloadSelected: ->
        data = @vmGet('grid.selection').data
        window.open data.url + "?download=1", data.uuid + '-download'

    showLink: ->
        data = @vmGet('grid.selection').data
        win = Ext.widget 'window',
            title: 'Link (URL)'
            glyph: 0xf0c1
            width: 500
            height: 110
            modal: true
            layout: 'fit',
            resizable: false
            bodyPadding: 20,
            items:
                xtype: 'textfield'
                value: data.url
                editable: false
                selectOnFocus: true

        win.show()

    openFilePicker: ->
        unless @fileInput
            @fileInput = Ext.DomHelper.append(Ext.getBody(), '<input type="file" name="file"/>');
            @fileInput.onchange = => @uploadFile(@fileInput.files[0])

        @fileInput.value = null
        @fileInput.click()

    uploadFile: (file) ->
        xhr = new XMLHttpRequest()

        # error
        xhr.onabort = xhr.onerror = onError = -> console.error('upload error', arguments)

         # success
        xhr.onload = (e) =>

             # error actually
            return onError() if xhr.status >= 300 || xhr.status < 200

            # pars
            newMedia = Ext.decode(xhr.responseText)
            src = Q1Plaza.app.uriForMedia(newMedia)

            # me.setProgress(0);
            @getStore('medias').load()

        # progress
        xhr.upload.onprogress = (e) ->
            if e.lengthComputable
                progressPercent = Math.ceil(e.loaded / e.total * 100)
                console.log progressPercent


        # send
        form = new FormData()
        form.append('file', file);

        xhr.open('POST', '/.media', true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(form);
