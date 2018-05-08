Ext.define('q1plaza.view.settings.GroupMembersController', {
  extend: 'q1plaza.base.ViewController',
  requires: ['Ext.menu.Menu'],
  alias: 'controller.settings-group-members',
  init: function() {
    var me, store;
    me = this;
    store = this.getView().getStore();
    return store.on('add', this.onAddMember, this);
  },
  refresh: function() {
    return this.getView().getStore().load();
  },
  onAddMember: function(store, records) {
    return Ext.Ajax.request({
      method: 'PUT',
      url: store.getProxy().getUrl(),
      jsonData: Ext.Array.map(records, function(r) {
        return r.data.id;
      }),
      success: (function(_this) {
        return function() {
          return _this.showMessage();
        };
      })(this)
    });
  },
  deleteSelected: function() {
    var me, store, user, view;
    me = this;
    view = this.getView();
    store = view.getStore();
    user = view.getSelection()[0];
    if (!user) {
      return;
    }
    return Ext.Msg.confirm('Remover', 'Remover <b>' + user.get('email') + '</b> do grupo?', function(btn) {
      if (btn !== 'yes') {
        return;
      }
      return Ext.Ajax.request({
        method: 'DELETE',
        url: store.getProxy().getUrl() + "/" + user.get('id'),
        success: function(res) {
          var data;
          data = Ext.decode(res.responseText);
          if (data.success) {
            store.remove(user);
            me.showMessage();
            return view.getSelectionModel().select(0);
          } else {
            console.error('erro ao remover usuario do grupo');
            return me.showError("Erro ao remover usuario do grupo.");
          }
        }
      });
    });
  },
  showItemContextMenu: function(view, record, element, i, evt) {
    this.contextMenu || (this.contextMenu = Ext.widget('menu', {
      viewModel: this.getViewModel(),
      items: [
        {
          text: 'Remover',
          handler: 'deleteSelected',
          scope: this
        }
      ]
    }));
    evt.preventDefault();
    return this.contextMenu.showAt(evt.getXY());
  }
});
