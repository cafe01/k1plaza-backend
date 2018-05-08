(function() {
  Ext.define('q1plaza.base.ViewController', {
    extend: 'Ext.app.ViewController',
    requires: [],
    successMessages: ['<i class="fa fa-thumbs-o-up"></i> Ok!'],
    errorMessages: ['Desculpe, ocorreu um erro. <i class="fa fa-meh-o"></i>'],
    getVM: function() {
      return this.getViewModel();
    },
    getApp: function() {
      return Q1Plaza.app;
    },
    showMessage: function(msg) {
      var msgs;
      msgs = this.successMessages;
      return this.getApp().showMessage(msg || msgs[Math.floor(Math.random() * msgs.length)]);
    },
    showError: function(msg) {
      var msgs;
      msgs = this.errorMessages;
      return this.getApp().showError(msg || msgs[Math.floor(Math.random() * msgs.length)]);
    },
    vmGet: function(key) {
      return this.getViewModel().get(key);
    },
    vmSet: function() {
      var vm;
      vm = this.getViewModel();
      return vm.set.apply(vm, arguments);
    }
  });

}).call(this);
