# coffeelint: disable=indentation,max_line_length
# out: ./$1.js
Ext.define 'q1plaza.view.settings.SitemapController',

    extend: 'q1plaza.base.ViewController'
    requires: ['Ext.menu.Menu']
    alias: 'controller.sitemap'

    pageFields: ['path', 'title', 'template', 'widget_args', 'is_root_page']

    init: ->
        me = @
        vm = @getViewModel()
        view = @getView()
        Ext.Ajax.request
            url: '/.resource/sitemap'
            success: (res) ->
                data = Ext.decode res.responseText
                me.loadSitemap(data)

    loadSitemap: (data) ->
        pages = data.page || []
        @formatSitemapInput pages
        @getView().getStore().setRootNode
            path: ''
            expanded: true
            page: pages


    formatSitemapInput: (pages) ->
        for page in pages
            if page.page
                page.leaf = false
                page.expanded = true
                @formatSitemapInput page.page
            else
                page.leaf = true

    onRowEdit: -> @vmSet 'isDirty', true

    deleteSelected: ->
        record = @vmGet('tree.selection')
        record.remove() if record
        @vmSet 'isDirty', true

    editSelected: ->
        record = @vmGet('tree.selection')
        return unless record
        @getView().getPlugin('editor').startEdit record


    openSelected: ->
        record = @vmGet('tree.selection')
        return unless record
        path = record.getPath('path', '/').replace('//', '/')
        window.open path, path.replace('/','')



    createNode: ->
        parentNode = @vmGet('tree.selection') or @getView().getRootNode()
        console.log parentNode
        newNode = parentNode.appendChild
            path: 'foo'
            title: 'Nova Pagina'
            leaf: true

        parentNode.expand()
        @getView().getPlugin('editor').startEdit newNode
        @vmSet 'isDirty', true


    saveSitemap: ->
        rootPath = null

        formatNodes = (nodes) =>
            pages = []
            for node in nodes
                page = Ext.copyTo {}, node.getData(), @pageFields
                rootPath = page.path if page.is_root_page
                page.page = formatNodes(node.childNodes) if node.hasChildNodes()
                pages.push page
            return pages

        root = @getView().getRootNode()
        pages = formatNodes(root.childNodes)
        sitemap =
            root: rootPath || pages[0].path
            page: pages

        Ext.Ajax.request
            method:'post'
            url: '/.resource/sitemap'
            jsonData: sitemap
            success: (res) =>
                @loadSitemap(sitemap)
                @vmSet 'isDirty', false


    showItemContextMenu: (view, record, element, i, evt) ->

        @contextMenu ||= Ext.widget 'menu',
            viewModel: @getViewModel()
            items: [
                {
                    handler: 'openSelected'
                    scope: @
                    bind:
                        text: 'Abrir página "{tree.selection.title}"'
                }
                {
                    text: 'Editar'
                    handler: 'editSelected'
                    scope: @
                }
                {
                    text: 'Nova Página'
                    handler: 'createNode'
                    scope: @
                }
                '-'
                {
                    text: 'Deletar'
                    handler: 'deleteSelected'
                    scope: @
                }
            ]

        evt.preventDefault()
        @contextMenu.showAt evt.getXY()
