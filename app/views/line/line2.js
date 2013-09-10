KISSY.add("app/views/line/line2", function(S, View, VOM, MM) {
    return View.extend({
        render: function(type) {
            this.setViewPagelet({

            },function(){

            },{
                config:{
                    chart:{
                        configData:'<chart v="1.0" type="line"><data shape="1" node="0" area="0"><colors normals="0x3300FF,0x3333FF,0x3366FF" overs="0xCC0000,0xCC3300,0xCC6600"/></data></chart>',
                    
                        chartData:'<chart><data><indexAxis labels="12月1号,12月2号,12月3号,12月4号,12月5号,12月6号,12月7号" name="维度2："><key indexs="5"/></indexAxis><sets name="维度1："><set values="83,81,77,71,68,70,68"></set><set values="43,41,37,31,28,30,28"></set><set values="143,141,137,131,128,130,128"></set></sets></data></chart>'
                    }
            }
            })
        }
    });
}, {
    requires: ["mxext/view", "magix/vom", "app/models/modelmanager"]
});