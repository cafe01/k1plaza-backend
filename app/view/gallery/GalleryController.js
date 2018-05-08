/*jslint white:true, unparam: true, sloppy: true, browser: true */
/*global Ext, Q1Plaza, console */

Ext.define('q1plaza.view.gallery.GalleryController', {
    extend: 'q1plaza.base.ViewController',
    alias: 'controller.gallery',

    init: function() {
        var me = this,
            view = me.getView();

        // when gallery is used directly (ie. not in expo)
        if (view.widgetRecord) {
            view.mediaCollection = view.widgetRecord.get('mediacollection_id');
            view.mediaMetadata = view.widgetRecord.get('config').media_metadata;
        }
    },

    onDataviewBeforeRender: function(dv, options) {
        var me = this,
            app = Q1Plaza.app,
            gallery = me.getView(),
            widgetName = gallery.serverWidget,
            store = me.getStore('medias');

        store.getProxy().setExtraParam('widget', widgetName);
        if (gallery.mediaCollection) {
            store.getProxy().setExtraParam('collection_id', gallery.mediaCollection);
        }

        // console.log('onDataviewBeforeRender');
        if (gallery.autoLoad !== false)  {
            store.load();
        }

        // cache size on resize
        // dv.availableWidth = dv.getWidth();
        gallery.on('resize', function(){
            var oldWidth = dv.availableWidth;
            dv.availableWidth = dv.getWidth();
            if (dv.availableWidth > 0 && dv.availableWidth !== oldWidth) {
                dv.refresh();
            }
        }, me, { buffer: 250 });

        // refresh on activate
        dv.on('activate', dv.refresh, dv);

        // file icons
        var file_icons = {
            pdf: 'fa-file-pdf-o',
            video: 'fa-file-video-o',
            image: 'fa-file-image-o',
            zip: 'fa-file-zip-o',
            word: 'fa-file-word-o',
            plain: 'fa-file-text-o'
        };

        // template
        dv.tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '{[ this.calcSize(values) ]}',
            '<div class="item-wrap content-box {[ values.file_mime_type ? values.file_mime_type.replace("/", "-") : "" ]}" style="margin:{thumbMargin}px 0 0 {thumbMargin}px; width:{thumbWidth}px; height:{thumbHeight}px;">',
                '<tpl if="is_uploading">',
                    '<progress value="{[ Math.ceil(values.progress) ]}" max="100"></progress>',
                '<tpl else>',
                    '<tpl if="file_mime_type.match(/image/)">',
                        '<img src="{[ this.getMediaUrl(values) ]}" class="thumbnail " />',

                    '<tpl else>',
                        '<div class="icon"><i class="fa {[this.iconClass(values)]}"></i></div>',
                        '<p class="filename" title="{file_name}">{file_name}</p>',
                    '</tpl>',
                '</tpl>',
                '<div class="fake-border"></div>',
            '</div>',
            '</tpl>',
            '<div class="clear"></div>',
            {
                compiled : true,
                extraItemWidth : 0,
                iconClass: function(media) {
                    var cls = 'fa-file-o';
                    Ext.Object.each(file_icons, function(key, value){
                        if (media.file_mime_type.match(key)) {
                            cls = value;
                            return false;
                        }
                    });
                    return cls;
                },
                calcSize: function(media) {

                    if (!dv) { return; }

                    var avilableWidth = dv.getWidth() - Ext.getScrollbarSize().width,
                        gridSize;

                    gridSize = 4;
                    if (avilableWidth > 800) { gridSize = 5; }

                    if (avilableWidth > 1000) { gridSize = 6; }

                    if (avilableWidth > 1200) { gridSize = 7; }


                    media.thumbMargin = 20;
                    media.thumbWidth  = Math.floor((avilableWidth - media.thumbMargin*(gridSize+1)) / gridSize);
                    media.thumbHeight = media.thumbWidth;

                //    console.log('cal size', avilableWidth, gridSize, media.thumbWidth);
                },

                getMediaUrl: function(media) {
                    return app.uriForMedia(media, { scale: media.thumbWidth +'x'+ media.thumbHeight, crop: true });
                }

            });
    },

    onSelectionChange: function(dataview, selection, options) {
        var me = this,
            count = selection.length;

        me.getViewModel().set('selection', selection);

        me.lookupReference('btnDelete')
          .setText(count > 1 ? 'Deletar '+count+' itens' : 'Deletar');
    },

    setupDragDrop: function(dataview, options) {
        var me = this,
            dragGroup = { deleteDrop: true },
            dropGroup = {};

        dragGroup[dataview.id] = true;
        dropGroup[dataview.id] = true;

        function getDataViewElements(dv) {
            return dv.getEl().select(dv.itemSelector);
        }

        function indexOfElement(element){
            var index = -1;

            getDataViewElements(dataview).each(function(el, composite, i) {
                //console.log('findind index', i, element, el, element.id, el.dom.id, element == el.dom);

                if (element === el.dom) {
                    index = i;
                    return false;
                }
            });

            return index;
        }

        dataview.dragZone = new Ext.dd.DragZone(dataview.getEl(), {

            //containerScroll: true,
            ddGroup: dragGroup,

            //      On receipt of a mousedown event, see if it is within a DataView node.
            //      Return a drag data object if so.
            getDragData: function(e) {

                //          Use the DataView's own itemSelector (a mandatory property) to
                //          test if the mousedown is within one of the DataView's nodes.
                var sourceEl = e.getTarget(dataview.itemSelector, 10),
                    ddel;

                if (!sourceEl) {
                    return;
                }

                //          If the mousedown is within a DataView node, clone the node to produce
                //          a ddel element for use by the drag proxy. Also add application data
                //          to the returned data object.

                ddel = sourceEl.cloneNode(true);
                ddel.id = Ext.id();
                return {
                    ddel: ddel,
                    sourceEl: sourceEl,
                    repairXY: Ext.fly(sourceEl).getXY(),
                    sourceStore: dataview.store,
                    draggedRecord: dataview.getRecord(sourceEl)
                };

            },


            getRepairXY: function() {
                return this.dragData.repairXY;
            },

            onStartDrag : function(e) {
                var dragData = this.dragData,
                    sourceEl = dragData.sourceEl;

                // console.log('onStartDrag', this, dragData);
                Ext.fly(sourceEl).setOpacity(0);
                me.fireViewEvent('startdeletedrag');
            },

            onEndDrag : function(e) {
                var dragData = this.dragData,
                    sourceEl = dragData.sourceEl;

                // console.log('onEndDrag', this, dragData);
                Ext.fly(sourceEl).setOpacity(1);
                me.fireViewEvent('enddeletedrag');
            }


        });


        dataview.dropZone = new Ext.dd.DropZone(dataview.getEl(), {


            ddGroup: dropGroup,


            // If the mouse is over a grid row, return that node. This is
            // provided as the "target" parameter in all "onNodeXXXX" node event handling functions
            getTargetFromEvent: function(e) {
                return e.getTarget(dataview.itemSelector);
            },

            // On entry into a target node, highlight that node.
            onNodeEnter : function(target, dd, e, data){

                var sourceIndex = indexOfElement(data.sourceEl),
                    targetIndex = indexOfElement(target),
                    dropMode = targetIndex > sourceIndex ? 'after' : 'before';

                data.targetIndex = targetIndex;

                if (target === data.sourceEl) {
                    return;
                }

                // console.log('onNodeEnter', sourceIndex, targetIndex, dropMode);

                Ext.fly(target).insertSibling(Ext.get(data.sourceEl), dropMode);

                //Ext.fly(target).addCls('my-row-highlight-class');
            },

            // // On exit from a target node, unhighlight that node.
            // onNodeOut : function(target, dd, e, data){
            //     //Ext.fly(target).removeCls('my-row-highlight-class');
            // },

            // While over a target node, return the default drop allowed class which
            // places a "tick" icon into the drag proxy.
            onNodeOver : function(target, dd, e, data){
                return Ext.dd.DropZone.prototype.dropAllowed;
            },

            // On node drop we can interrogate the target to find the underlying
            // application object that is the real target of the dragged data.
            // In this case, it is a Record in the GridPanel's Store.
            // We can use the data set up by the DragZone's getDragData method to read
            // any data we decided to attach in the DragZone's getDragData method.
            onNodeDrop : function(target, dd, e, data){
                // console.log('drop gesture', arguments);

                var targetIndex = data.targetIndex,
                    record = data.draggedRecord,
                    store = data.sourceStore,
                    targetRecord =  store.getAt(targetIndex);

                if (record === targetRecord) {
                    //console.log('dropped in the same place', record, targetRecord);
                    return;
                }

                me.fireViewEvent('reorder', me.getView(), record, targetRecord);

                store.remove(record, true);
                store.insert(targetIndex, record);

                //console.log('onNodeDrop', sourceIndex, targetIndex);

                return true;
            }
        });
    },

    onReorder: function(view, srcMedia, targetMedia) {
        var me = this;

        Ext.Ajax.request({
            url: '/.media/reposition?widget='+view.serverWidget,
            method: 'POST',
            jsonData: {
                collection: view.getMediaCollection(),
                src_media: srcMedia.get('id'),
                dst_media: targetMedia.get('id')
            },
            failure: function(response){
                me.showError();
            }
        });
    },

    onDeleteClick: function(button, e, options) {
        var me = this,
            dv = me.lookupReference('dataview'),
            store = dv.getStore(),
            records = dv.getSelectionModel().getSelection(),
            count = records.length,
            format = Ext.String.format,
            message = count > 1 ? format('Realmente deseja deletar os <b>{0} itens</b> selecionados?', count) : format('Realmente deseja deletar o item selecionado?');


        Ext.MessageBox.confirm('Confirmação', message, function(btn){
            if (btn !== 'yes') { return; }
            //console.log(arguments);
            store.remove(records);
            store.sync();
            me.showMessage('Ok.');
        });
    },

    onEditClick: function() {
        var me = this,
            metadata = me.getView().getMediaMetadata(),
            record = me.getViewModel().get('selection')[0],
            editPanel = me.lookupReference('editPanel');

        editPanel.setFields(Q1Plaza.app.generateFormFields(metadata));
        editPanel.setRecord(record);
        me.lookupReference('dataview').disable();
        me.getViewModel().set('editMode', true);
    },

    onEditComplete: function() {
        this.vmSet('editMode', false);
    },

    onAddClick: function() {
        var me = this,
            fileInput = Ext.DomHelper.append(Ext.getBody(), '<input type="file" name="file" multiple/>');

        fileInput.onchange = function() {
            Ext.Array.each(fileInput.files, function(file){
                me.uploadFile(file);
            });
        };

        fileInput.click();
    },

    uploadFile: function(file) {
        var me = this,
            view = me.getView(),
            store = me.getStore('medias'),
            Model = store.getModel(),
            record = new Model({ is_uploading: true, progress: 0 }),
            form = new FormData(),
            xhr = new XMLHttpRequest(),
            proxy = store.getProxy(),
            url = proxy.getUrl() + '?' + Ext.Object.toQueryString(Ext.apply({}, { widget: me.getView().serverWidget }, proxy.extraParams));

        console.log('extraparams', proxy.extraParams);

        // add file
        form.append('file', file);
        form.append('collection_id', view.getMediaCollection());

        function onError() {
            console.error('upload error', arguments);
            store.remove(record);
        }

        // errors
        xhr.onabort = onError;
        xhr.onerror = onError;

        // success
        xhr.onload = function(e) {

            // error actually
            if (xhr.status >= 300 || xhr.status < 200) {
                onError();
                return;
            }

            var response = Ext.decode(xhr.responseText),
                newMedia = new Model(response.items);

            store.insert(store.indexOf(record), newMedia);
            store.remove(record);
        };

        xhr.onloadstart = function() {
            console.log('uploadstart');
            store.add(record);
        };

        // upload progress
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var progressPercent = (e.loaded / e.total) * 100;
                record.set('progress', progressPercent);
            }
        };

        // send
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(form);
    }






});
