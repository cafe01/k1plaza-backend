Ext.define('q1plaza.view.main.MainController', {
  extend: 'q1plaza.base.ViewController',
  requires: ['q1plaza.model.User'],
  alias: 'controller.main',
  control: {
    '#centerPanel panel': {
      activate: 'onChangeView'
    }
  },
  init: function() {
    var vm;
    vm = this.getViewModel();
    this.initMenu();
    vm.set('main', this);
    return Ext.Ajax.request({
      url: '/.resource/user/me',
      success: function(xhr) {
        return vm.set('loggedInUser', Ext.create('q1plaza.model.User', Ext.decode(xhr.responseText)));
      }
    });
  },
  initMenu: function(store) {
    var Model, fn, group, groups, groupsConfig, items, lastOpenWidget, lastOpenWidgetRecord, name;
    lastOpenWidget = Ext.state.Manager.get('lastOpenWidget');
    lastOpenWidgetRecord = null;
    store = this.getStore('menuItems');
    Model = store.getModel();
    items = [];
    groups = {};
    groupsConfig = this.vmGet('config').menu_groups || {};
    _.each(this.vmGet('config').widgets || [], function(widget) {
      var config, group, name1;
      if (!widget.config.backend_view) {
        return;
      }
      config = widget.config;
      widget.title = widget.config.title;
      widget.view = widget.config.backend_view;
      widget.viewConfig = widget.config.backend_view_config;
      widget.icon = widget.viewConfig.menuIcon;
      widget = Ext.create('q1plaza.model.Widget', widget);
      if (widget.get('name') === lastOpenWidget) {
        widget.set('active', true);
        lastOpenWidgetRecord = widget;
      }
      if (config.menu_group) {
        groups[name1 = config.menu_group] || (groups[name1] = Ext.apply({
          title: config.menu_group,
          icon: 'list',
          isGroup: true,
          items: []
        }, groupsConfig[config.menu_group] || {}));
        group = groups[config.menu_group];
        return group.items.push(widget);
      } else {
        return items.push(widget);
      }
    });
    store.filterBy(function(rec) {
      if (!rec.get('hidden')) {
        return true;
      }
    });
    for (name in groups) {
      group = groups[name];
      items.push(group);
    }
    items.push.apply(items, _.map(this.getView().menuItems, function(item) {
      item.cls = 'system-item';
      return item;
    }));
    store.add(items);
    if (lastOpenWidgetRecord) {
      this.openWidgetByRecord(lastOpenWidgetRecord);
    }
    this.fireViewEvent('menuready');
    fn = function() {
      return Ext.getBody().addCls('menu-ready');
    };
    return setTimeout(fn, 100);
  },
  onMenuItemClick: function(evt, element) {
    var el, record, store;
    el = Ext.fly(element);
    store = this.getStore('menuItems');
    record = store.getById(el.getAttribute('data-item-id'));
    if (!record) {
      return console.error('menu record not found', el.getAttribute('data-item-id'), el);
    }
    if (record.get('isGroup')) {
      return this.showMenuGroupItems(evt, record);
    }
    if (record.get('view')) {
      this.openWidgetByRecord(record);
    }
    if (record.get('handler')) {
      this[record.get('handler')].call(this);
    }
    if (record.get('href')) {
      return window.open(record.get('href'));
    }
  },
  showMenuGroupItems: function(evt, group) {
    var menu, menuItems, vm;
    menuItems = [];
    vm = this;
    _.each(group.get('items'), function(record) {
      return menuItems.push({
        text: record.get('title'),
        handler: function() {
          return vm.openWidgetByRecord(record);
        }
      });
    });
    menu = Ext.widget('menu', {
      items: menuItems
    });
    return menu.showAt(evt.getXY());
  },
  openWidgetByRecord: function(record) {
    var data, id, widgetConfig, xtype;
    data = record.data;
    xtype = data.view || data.name;
    id = 'widget-' + record.get('id');
    widgetConfig = Ext.apply({}, data.viewConfig || {}, {
      title: data.title,
      serverWidget: data.name,
      widgetRecord: record
    });
    Ext.state.Manager.set('lastOpenWidget', data.name);
    return this.openWidget(id, xtype, widgetConfig);
  },
  openWidget: function(widgetId, widgetXtype, config) {
    var centerPanel, widget;
    centerPanel = this.lookupReference('centerPanel');
    widget = centerPanel.getComponent(widgetId);
    config = config || {};
    widgetXtype = widgetXtype || widgetId;
    if (!widget) {
      Ext.apply(config, {
        itemId: widgetId,
        closeable: true
      });
      widget = Ext.widget(widgetXtype, config);
      centerPanel.add(widget);
    }
    centerPanel.setActiveItem(widget);
    return widget;
  },
  setActiveItem: function(panel) {
    return this.lookupReference('centerPanel').setActiveItem(panel);
  },
  onChangeView: function(panel) {
    var menuItems;
    menuItems = this.getStore('menuItems');
    menuItems.each(function(item) {
      return item.set('active', false);
    });
    if (panel.widgetRecord) {
      panel.widgetRecord.set('active', true);
    }
    return this.lookupReference('mainMenu').update(menuItems);
  },
  onBeforeAddPanel: function(centerPanel, panel) {
    return panel.setUI('main-panel');
  },
  onLogoutClick: function() {
    return Ext.MessageBox.confirm('Confirmação', 'Sair do painel de controle?', function(btn) {
      if (btn !== 'yes') {
        return;
      }
      return window.location = '/.logout';
    });
  }
});
