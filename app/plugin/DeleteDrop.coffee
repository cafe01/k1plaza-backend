# coffeelint: disable=indentation,max_line_length

Ext.define('q1plaza.plugin.DeleteDrop',
    extend: 'Ext.plugin.Abstract'
    alias: 'plugin.deletedrop'
    requires: ['Ext.dd.DropZone']

    dragInviteCls: 'delete-drag-invitation'
    dropInviteCls: 'delete-drop-invitation'

    init: (cmp) ->
        @cmp = cmp

        cmp.on(
            scope: @
            afterrender: @initDropZone
            startdeletedrag: @addDragInvitation
            enddeletedrag: @removeDragInvitation
        )

    addDragInvitation: -> @dropEl.addCls(@dragInviteCls) unless @disabled

    removeDragInvitation: ->
        @dropEl.removeCls(@dragInviteCls) unless @disabled
        true

    initDropZone: (cmp) ->
        me = @
        dropEl = @dropEl
        dropCls = @dropInviteCls

        if Ext.isString(dropEl)
            dropEl = cmp.lookupReference(dropEl) || cmp[dropEl]

        if dropEl.isComponent
            dropEl = dropEl.getEl()

        @dropEl = dropEl
        unless dropEl
            @disable()
            return
        # console.log "initDropzone dropEl", dropEl

        @dropZone = Ext.create('Ext.dd.DropZone', dropEl,

            ddGroup: { deleteDrop: true }

            getTargetFromEvent: (e) ->
                e.getTarget('#' + dropEl.dom.id)

            onNodeEnter: (target) ->
                Ext.fly(target).addCls(dropCls)

            onNodeOut: (target) ->
                Ext.fly(target).removeCls(dropCls)

            onNodeDrop: (target, dd, e, data) ->

                me.removeDragInvitation()

                if data.onDeleteDrop
                    data.onDeleteDrop(data)
                    return

                records;

                if data.records
                    records = data.records
                else if data.draggedRecord
                    data.draggedRecord.erase()

                me.cmp.fireEvent('deletedrop', me.cmp, records)
                return if me.deleteEventOnly
                records.forEach (r) -> r.erase()
        )

        # inject trashbin el
        trashParent = dropEl.child('[data-ref=innerCt]') || dropEl
        Ext.DomHelper.append(trashParent, '<div class="delete-drop-zone"><i class="fa fa-trash-o"></i></div>')

        # monitor drag
        @monitorDragEnd()

    monitorDragEnd: ->
        me = @
        cmp = @cmp
        grids = []

        if cmp.xtype == 'grid'
            grids.push cmp
        else
            grids = grids.concat(cmp.query('grid'))

        # listen
        grids.map((g) -> g.getView())
             .forEach((v) ->
                 return if v.getPlugins().filter((p) -> p.ptype == "gridviewdragdrop").length == 0
                 v.on('drop', me.removeDragInvitation, me)
             )


)
