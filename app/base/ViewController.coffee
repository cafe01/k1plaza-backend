# coffeelint: disable=indentation,max_line_length

Ext.define('q1plaza.base.ViewController',

    extend: 'Ext.app.ViewController'

    requires: []

    successMessages: [
        '<i class="fa fa-thumbs-o-up"></i> Ok!'
    ]

    errorMessages: [
        'Desculpe, ocorreu um erro. <i class="fa fa-meh-o"></i>'
    ]

    getVM: -> @getViewModel()

    getApp: ->  Q1Plaza.app

    showMessage: (msg) ->
        msgs = @successMessages
        @getApp().showMessage(msg || msgs[Math.floor(Math.random()*msgs.length)])

    showError: (msg) ->
        msgs = @errorMessages
        @getApp().showError(msg || msgs[Math.floor(Math.random()*msgs.length)])

    vmGet: (key) -> @getViewModel().get(key)

    vmSet: ->
        vm = @getViewModel()
        vm.set.apply(vm, arguments)

)
