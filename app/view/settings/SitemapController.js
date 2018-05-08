Ext.define('q1plaza.view.settings.SitemapController', {
  extend: 'q1plaza.base.ViewController',
  requires: ['Ext.menu.Menu'],
  alias: 'controller.sitemap',
  pageFields: ['path', 'title', 'template', 'widget_args', 'is_root_page'],
  init: function() {
    var me, view, vm;
    me = this;
    vm = this.getViewModel();
    view = this.getView();
    return Ext.Ajax.request({
      url: '/.resource/sitemap',
      success: function(res) {
        var data;
        data = Ext.decode(res.responseText);
        return me.loadSitemap(data);
      }
    });
  },
  loadSitemap: function(data) {
    var pages;
    pages = data.page || [];
    this.formatSitemapInput(pages);
    return this.getView().getStore().setRootNode({
      path: '',
      expanded: true,
      page: pages
    });
  },
  formatSitemapInput: function(pages) {
    var j, len, page, results;
    results = [];
    for (j = 0, len = pages.length; j < len; j++) {
      page = pages[j];
      if (page.page) {
        page.leaf = false;
        page.expanded = true;
        results.push(this.formatSitemapInput(page.page));
      } else {
        results.push(page.leaf = true);
      }
    }
    return results;
  },
  onRowEdit: function() {
    return this.vmSet('isDirty', true);
  },
  deleteSelected: function() {
    var record;
    record = this.vmGet('tree.selection');
    if (record) {
      record.remove();
    }
    return this.vmSet('isDirty', true);
  },
  editSelected: function() {
    var record;
    record = this.vmGet('tree.selection');
    if (!record) {
      return;
    }
    return this.getView().getPlugin('editor').startEdit(record);
  },
  openSelected: function() {
    var path, record;
    record = this.vmGet('tree.selection');
    if (!record) {
      return;
    }
    path = record.getPath('path', '/').replace('//', '/');
    return window.open(path, path.replace('/', ''));
  },
  createNode: function() {
    var newNode, parentNode;
    parentNode = this.vmGet('tree.selection') || this.getView().getRootNode();
    console.log(parentNode);
    newNode = parentNode.appendChild({
      path: 'foo',
      title: 'Nova Pagina',
      leaf: true
    });
    parentNode.expand();
    this.getView().getPlugin('editor').startEdit(newNode);
    return this.vmSet('isDirty', true);
  },
  saveSitemap: function() {
    var formatNodes, pages, root, rootPath, sitemap;
    rootPath = null;
    formatNodes = (function(_this) {
      return function(nodes) {
        var j, len, node, page, pages;
        pages = [];
        for (j = 0, len = nodes.length; j < len; j++) {
          node = nodes[j];
          page = Ext.copyTo({}, node.getData(), _this.pageFields);
          if (page.is_root_page) {
            rootPath = page.path;
          }
          if (node.hasChildNodes()) {
            page.page = formatNodes(node.childNodes);
          }
          pages.push(page);
        }
        return pages;
      };
    })(this);
    root = this.getView().getRootNode();
    pages = formatNodes(root.childNodes);
    sitemap = {
      root: rootPath || pages[0].path,
      page: pages
    };
    return Ext.Ajax.request({
      method: 'post',
      url: '/.resource/sitemap',
      jsonData: sitemap,
      success: (function(_this) {
        return function(res) {
          _this.loadSitemap(sitemap);
          return _this.vmSet('isDirty', false);
        };
      })(this)
    });
  },
  showItemContextMenu: function(view, record, element, i, evt) {
    this.contextMenu || (this.contextMenu = Ext.widget('menu', {
      viewModel: this.getViewModel(),
      items: [
        {
          handler: 'openSelected',
          scope: this,
          bind: {
            text: 'Abrir página "{tree.selection.title}"'
          }
        }, {
          text: 'Editar',
          handler: 'editSelected',
          scope: this
        }, {
          text: 'Nova Página',
          handler: 'createNode',
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
