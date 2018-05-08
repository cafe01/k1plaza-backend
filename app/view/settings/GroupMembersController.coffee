# coffeelint: disable=indentation,max_line_length
# out: ./$1.js
Ext.define 'q1plaza.view.settings.GroupMembersController',

    extend: 'q1plaza.base.ViewController'
    requires: ['Ext.menu.Menu']
    alias: 'controller.settings-group-members'

    init: ->
        me = @
        store = @getView().getStore()
        store.on 'add', @onAddMember, @

    refresh: -> @getView().getStore().load()

    onAddMember: (store, records) ->
        Ext.Ajax.request
            method: 'PUT'
            url: store.getProxy().getUrl()
            jsonData: Ext.Array.map(records, (r) -> r.data.id)
            success: => @showMessage()

    deleteSelected: ->
        me = @
        view = @getView()
        store = view.getStore()
        user = view.getSelection()[0]
        return unless user

        Ext.Msg.confirm 'Remover', 'Remover <b>' + user.get('email') + '</b> do grupo?', (btn) ->
            return unless btn == 'yes'
            Ext.Ajax.request
                method: 'DELETE'
                url: store.getProxy().getUrl() + "/" + user.get('id')
                success: (res) ->
                    data = Ext.decode res.responseText
                    if data.success
                        store.remove user
                        me.showMessage()
                        view.getSelectionModel().select(0)
                    else
                        console.error 'erro ao remover usuario do grupo'
                        me.showError("Erro ao remover usuario do grupo.")



    showItemContextMenu: (view, record, element, i, evt) ->

        @contextMenu ||= Ext.widget 'menu',
            viewModel: @getViewModel()
            items: [
                {
                    text: 'Remover'
                    handler: 'deleteSelected'
                    scope: @
                }
            ]

        evt.preventDefault()
        @contextMenu.showAt evt.getXY()
