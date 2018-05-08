(function() {
  Ext.define('q1plaza.plugin.DeleteDrop', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.deletedrop',
    requires: ['Ext.dd.DropZone'],
    dragInviteCls: 'delete-drag-invitation',
    dropInviteCls: 'delete-drop-invitation',
    init: function(cmp) {
      this.cmp = cmp;
      return cmp.on({
        scope: this,
        afterrender: this.initDropZone,
        startdeletedrag: this.addDragInvitation,
        enddeletedrag: this.removeDragInvitation
      });
    },
    addDragInvitation: function() {
      if (!this.disabled) {
        return this.dropEl.addCls(this.dragInviteCls);
      }
    },
    removeDragInvitation: function() {
      if (!this.disabled) {
        this.dropEl.removeCls(this.dragInviteCls);
      }
      return true;
    },
    initDropZone: function(cmp) {
      var dropCls, dropEl, me, trashParent;
      me = this;
      dropEl = this.dropEl;
      dropCls = this.dropInviteCls;
      if (Ext.isString(dropEl)) {
        dropEl = cmp.lookupReference(dropEl) || cmp[dropEl];
      }
      if (dropEl.isComponent) {
        dropEl = dropEl.getEl();
      }
      this.dropEl = dropEl;
      if (!dropEl) {
        this.disable();
        return;
      }
      this.dropZone = Ext.create('Ext.dd.DropZone', dropEl, {
        ddGroup: {
          deleteDrop: true
        },
        getTargetFromEvent: function(e) {
          return e.getTarget('#' + dropEl.dom.id);
        },
        onNodeEnter: function(target) {
          return Ext.fly(target).addCls(dropCls);
        },
        onNodeOut: function(target) {
          return Ext.fly(target).removeCls(dropCls);
        },
        onNodeDrop: function(target, dd, e, data) {
          var records;
          me.removeDragInvitation();
          if (data.onDeleteDrop) {
            data.onDeleteDrop(data);
            return;
          }
          records;
          if (data.records) {
            records = data.records;
          } else if (data.draggedRecord) {
            data.draggedRecord.erase();
          }
          me.cmp.fireEvent('deletedrop', me.cmp, records);
          if (me.deleteEventOnly) {
            return;
          }
          return records.forEach(function(r) {
            return r.erase();
          });
        }
      });
      trashParent = dropEl.child('[data-ref=innerCt]') || dropEl;
      Ext.DomHelper.append(trashParent, '<div class="delete-drop-zone"><i class="fa fa-trash-o"></i></div>');
      return this.monitorDragEnd();
    },
    monitorDragEnd: function() {
      var cmp, grids, me;
      me = this;
      cmp = this.cmp;
      grids = [];
      if (cmp.xtype === 'grid') {
        grids.push(cmp);
      } else {
        grids = grids.concat(cmp.query('grid'));
      }
      return grids.map(function(g) {
        return g.getView();
      }).forEach(function(v) {
        if (v.getPlugins().filter(function(p) {
          return p.ptype === "gridviewdragdrop";
        }).length === 0) {
          return;
        }
        return v.on('drop', me.removeDragInvitation, me);
      });
    }
  });

}).call(this);
