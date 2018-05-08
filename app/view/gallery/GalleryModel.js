/*jslint white:true, unparam: true, sloppy: true*/
/*global Ext, Q1Plaza */

Ext.define('q1plaza.view.gallery.GalleryModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.gallery',
    requires: ['q1plaza.model.Media'],

    data: {
        selection: [],
        editMode: false
    },

    stores: {
        medias: {
            model: 'Media',
            pageSize: 100
        }
    },

    formulas: {
        hasSelection: {
            bind: '{selection}',
            get: function(data) {
                return data.length > 0;
            }
        },

        hasSingleSelection: {
            bind: '{selection}',
            get: function(data) {
                return data.length === 1;
            }
        },
        activeItem: {
            bind: '{editMode}',
            get: function(editMode) {
                return editMode ? 1 : 0;
            }
        }
    }


});
