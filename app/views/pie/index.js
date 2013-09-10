KISSY.add("app/views/pie/index", function(S, View, VOM, MM) {
    return View.extend({
        render: function(type) {
            this.setViewPagelet({

            },function(){

            },{
                config:{
                    chart:{
                       configData:'<chart v="1.0" type="pie"><data><colors normals="0xF74D7D,0x6280A1,0x5BCB8A,0xB0704A" overs="0xD94C74,0x4D6580,0x36B26A,0x8C5738" mode="1"/><list/></data></chart>',
                            
                        chartData:'<chart><data><indexAxis/><sets><set values="1445,1023,550,150" names="女性：,男性：,家庭：,其他："></set></sets></data></chart>'
                    }
                }
            })
        }
    });
}, {
    requires: ["mxext/view", "magix/vom", "app/models/modelmanager"]
});