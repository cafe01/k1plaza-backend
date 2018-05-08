Ext.define('q1plaza.view.medias.MediasController', {
  extend: 'q1plaza.base.ViewController',
  requires: ['q1plaza.model.Media'],
  alias: 'controller.medias',
  init: function() {
    var store, vm;
    vm = this.getViewModel();
    store = this.getStore('medias');
    return store.load();
  },
  deleteSelected: function() {
    var grid, msg, records, store;
    grid = this.lookupReference('grid');
    records = grid.getSelection();
    store = this.getStore('medias');
    msg = 'Deletar o arquivo selecionado?';
    if (records.length > 1) {
      msg = Ext.String.format('Deletar os <strong>{0} arquivos</strong> selecionados?', records.length);
    }
    return Ext.MessageBox.confirm('Confirmação', msg, (function(_this) {
      return function(btn) {
        if (btn !== 'yes') {
          return;
        }
        store.remove(records);
        store.sync();
        return _this.showMessage('OK');
      };
    })(this));
  },
  renameSelected: function() {
    var callback, record;
    record = this.vmGet('grid.selection');
    callback = (function(_this) {
      return function(btn, value) {
        if (!(btn === 'ok' && value.match(/\w/))) {
          return;
        }
        console.log('newname', value);
        record.set('file_name', value);
        return record.save();
      };
    })(this);
    return Ext.MessageBox.prompt('Renomear', 'Novo nome:', callback, null, null, record.get('file_name'));
  },
  viewSelected: function() {
    var data;
    data = this.vmGet('grid.selection').data;
    return window.open(data.url, data.uuid);
  },
  downloadSelected: function() {
    var data;
    data = this.vmGet('grid.selection').data;
    return window.open(data.url + "?download=1", data.uuid + '-download');
  },
  showLink: function() {
    var data, win;
    data = this.vmGet('grid.selection').data;
    win = Ext.widget('window', {
      title: 'Link (URL)',
      glyph: 0xf0c1,
      width: 500,
      height: 110,
      modal: true,
      layout: 'fit',
      resizable: false,
      bodyPadding: 20,
      items: {
        xtype: 'textfield',
        value: data.url,
        editable: false,
        selectOnFocus: true
      }
    });
    return win.show();
  },
  openFilePicker: function() {
    if (!this.fileInput) {
      this.fileInput = Ext.DomHelper.append(Ext.getBody(), '<input type="file" name="file"/>');
      this.fileInput.onchange = (function(_this) {
        return function() {
          return _this.uploadFile(_this.fileInput.files[0]);
        };
      })(this);
    }
    this.fileInput.value = null;
    return this.fileInput.click();
  },
  uploadFile: function(file) {
    var form, onError, xhr;
    xhr = new XMLHttpRequest();
    xhr.onabort = xhr.onerror = onError = function() {
      return console.error('upload error', arguments);
    };
    xhr.onload = (function(_this) {
      return function(e) {
        var newMedia, src;
        if (xhr.status >= 300 || xhr.status < 200) {
          return onError();
        }
        newMedia = Ext.decode(xhr.responseText);
        src = Q1Plaza.app.uriForMedia(newMedia);
        return _this.getStore('medias').load();
      };
    })(this);
    xhr.upload.onprogress = function(e) {
      var progressPercent;
      if (e.lengthComputable) {
        progressPercent = Math.ceil(e.loaded / e.total * 100);
        return console.log(progressPercent);
      }
    };
    form = new FormData();
    form.append('file', file);
    xhr.open('POST', '/.media', true);
    xhr.setRequestHeader('Accept', 'application/json');
    return xhr.send(form);
  }
});
