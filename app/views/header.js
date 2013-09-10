KISSY.add("app/views/header", function(S, View, MM) {
    return View.extend({
        render: function() {
            var me = this;
            me.setViewPagelet();
        },
        locationChange: function(e) {
            return;
            if (e.location.pathname == '/home') { //回到首页后重读未读数据
                this.render();
            } else {
                if (Math.random() < 0.3) { //30%读取一次未读数据，防止一直不更新未读消息
                    this.render();
                }
            }
        }
    });
}, {
    requires: ["mxext/view", "app/models/modelmanager"]
});