KISSY.add("app/views/line/index", function(S, View, VOM, MM) {
    return View.extend({
        render: function(type) {
            this.setViewPagelet({

            },function(){

            },{
                config:{
                    chart:{
                        configData:'<chart v="1.0" type="line"><data shape="0" node="1" area="0"/></chart>',
                        chartData:'<chart><data><indexAxis labels="12月1号,12月2号,12月3号,12月4号,12月5号,12月6号,12月7号" name="维度2："/><sets name="维度1："><set values="83,81,77,71,68,70,68"></set></sets></data></chart>'
                    }
                }
            })
        }
    });
}, {
    requires: ["mxext/view", "magix/vom", "app/models/modelmanager"]
});