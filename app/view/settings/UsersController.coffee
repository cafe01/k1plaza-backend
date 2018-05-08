# coffeelint: disable=indentation,max_line_length
# out: ./$1.js
Ext.define 'q1plaza.view.settings.UsersController',

    extend: 'q1plaza.base.ViewController'
    # requires: ['Ext.menu.Menu']
    alias: 'controller.settings-users'

    init: ->
        me = @
        view = @getView()

        adminsPanel = @lookupReference('adminsPanel')
        adminsPanel.getStore().load()

    promoteAdmin: ->
        user = @vmGet('grid.selection')
        adminsPanel = @lookupReference('adminsPanel')
        store = adminsPanel.getStore()
        if store.getById(user.get('id'))
            console.warn 'usuario %s já é admin', user.get('email')
            return

        store.add user
        store.sync()

    createUser: ->
        Ext.Msg.prompt 'Novo usuario', 'Digite o email do novo usuário', (btn, email) =>
            return unless btn == 'ok' and email.match(/@/)

            store = @getStore 'users'
            user = Ext.create 'q1plaza.model.User', { email: email }
            user.save
                success: -> store.insert 0, user
                failure: ->
                    console.warn 'erro ao salvar novo usuario', arguments

    deleteSelected: ->
        user = @vmGet('grid.selection')
        Ext.Msg.confirm 'Deletar', 'Deletar usuário <b>' + user.get('email') + '</b>?', (btn) =>
            return unless btn == 'yes'

            store = @getStore 'users'
            store.remove user
            store.sync
                success: -> console.info 'usuario removido com sucesso'
                failure: ->
                    console.warn 'erro ao deletar usuario', arguments


    showItemContextMenu: (view, record, element, i, evt) ->

        @contextMenu ||= Ext.widget 'menu',
            viewModel: @getViewModel()
            items: [
                text: 'Tornar Administrador'
                handler: 'promoteAdmin'
                scope: @
                , '-',
                text: 'Deletar'
                handler: 'deleteSelected'
                scope: @
            ]

        evt.preventDefault()
        @contextMenu.showAt evt.getXY()
