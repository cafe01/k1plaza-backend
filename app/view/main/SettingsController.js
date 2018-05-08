Ext.define('q1plaza.view.main.SettingsController', {
  extend: 'q1plaza.base.ViewController',
  alias: 'controller.main-settings',
  init: function() {
    var view;
    return view = this.getView();
  },
  onTabChange: function(tabPanel, tab) {
    tabPanel.setTitle(tab.getTitle());
    return tabPanel.setGlyph(tab.getGlyph());
  }
});
