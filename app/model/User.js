Ext.define('q1plaza.model.User', {
    extend: 'q1plaza.model.Base',
    proxy: {
        url: '/.resource/user',
        extraParams: {
            envelope: 1
        }
    },
    fields: [
        'first_name', 'last_name',
        {
            name: 'fullName',
            calculate: function (data) {
                return data.first_name && data.last_name ? data.first_name + ' ' + data.last_name
                                                          : data.first_name;
            }
        },
        {
            name: 'last_login_at',
            type: 'date',
            convert: function(value) {
                if (!value) return null;
                return moment.utc(value).local();
            }

        },
        {
            name: 'created_at',
            type: 'date',
            convert: function(value) {
                if (!value) return null;
                return moment.utc(value).local();
            }
        }
    ],
    hasRole: function(testValue) {
        var roles = this.data.roles || [];
        for (var i = 0; i < roles.length; i++) {
            var role = roles[i],
                rolename = typeof role == 'string' ? role : role.rolename;

            if (testValue == rolename) return true;
        }
        return false;
    }

});
