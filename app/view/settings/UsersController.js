Ext.define('q1plaza.view.settings.UsersController', {
  extend: 'q1plaza.base.ViewController',
  alias: 'controller.settings-users',
  init: function() {
    var adminsPanel, me, view;
    me = this;
    view = this.getView();
    adminsPanel = this.lookupReference('adminsPanel');
    return adminsPanel.getStore().load();
  },
  promoteAdmin: function() {
    var adminsPanel, store, user;
    user = this.vmGet('grid.selection');
    adminsPanel = this.lookupReference('adminsPanel');
    store = adminsPanel.getStore();
    if (store.getById(user.get('id'))) {
      console.warn('usuario %s já é admin', user.get('email'));
      return;
    }
    store.add(user);
    return store.sync();
  },
  createUser: function() {
    return Ext.Msg.prompt('Novo usuario', 'Digite o email do novo usuário', (function(_this) {
      return function(btn, email) {
        var store, user;
        if (!(btn === 'ok' && email.match(/@/))) {
          return;
        }
        store = _this.getStore('users');
        user = Ext.create('q1plaza.model.User', {
          email: email
        });
        return user.save({
          success: function() {
            return store.insert(0, user);
          },
          failure: function() {
            return console.warn('erro ao salvar novo usuario', arguments);
          }
        });
      };
    })(this));
  },
  deleteSelected: function() {
    var user;
    user = this.vmGet('grid.selection');
    return Ext.Msg.confirm('Deletar', 'Deletar usuário <b>' + user.get('email') + '</b>?', (function(_this) {
      return function(btn) {
        var store;
        if (btn !== 'yes') {
          return;
        }
        store = _this.getStore('users');
        store.remove(user);
        return store.sync({
          success: function() {
            return console.info('usuario removido com sucesso');
          },
          failure: function() {
            return console.warn('erro ao deletar usuario', arguments);
          }
        });
      };
    })(this));
  },
  showItemContextMenu: function(view, record, element, i, evt) {
    this.contextMenu || (this.contextMenu = Ext.widget('menu', {
      viewModel: this.getViewModel(),
      items: [
        {
          text: 'Tornar Administrador',
          handler: 'promoteAdmin',
          scope: this
        }, '-', {
          text: 'Deletar',
          handler: 'deleteSelected',
          scope: this
        }
      ]
    }));
    evt.preventDefault();
    return this.contextMenu.showAt(evt.getXY());
  }
});
