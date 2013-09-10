KISSY.add("app/views/home/index", function(S, View, VOM, MM) {
    return View.extend({
        init: function(e) {

        },
        render: function(type) {
            this.setViewPagelet()
        },
        locationChange: function(e) {

        }
    });
}, {
    requires: ["mxext/view", "magix/vom", "app/models/modelmanager"]
});