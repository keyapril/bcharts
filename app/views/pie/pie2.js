KISSY.add("app/views/pie/pie2", function(S, View, VOM, MM) {
    return View.extend({
        render: function(type) {
            this.setViewPagelet({

            },function(){

            },{
                config:{
                    chart:{
                     configData:'<chart v="1.0" type="pie"><data><colors normals="0x3300FF,0x3333FF,0x3366FF" overs="0xCC0000,0xCC3300,0xCC6600"/></data></chart>',
                            
                        chartData:'<chart><data><indexAxis/><sets><set values="1445,150,550,1023,130,200,300,400,500,600" names="名称1：,名称2：,名称3：,名称4：,名称5：,名称6：,名称7：,名称8：,名称9：,名称10："></set></sets></data></chart>'
                    }
            }
            })
        }
    });
}, {
    requires: ["mxext/view", "magix/vom", "app/models/modelmanager"]
});