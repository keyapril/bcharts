(function () {
    KISSY.config({
        packages: {
            magix:{
                base:'http://a.tbcdn.cn/apps/e/magix/1.1'
            },
            app:{
                base:'./'
            },
            'mux.bcharts':{
                base:'./'
            }
        }
    })

    KISSY.use('magix/magix',function(S,Magix){
        Magix.start({
          iniFile:'app/ini',
          rootId:'magix_vf_root',
          extensions: ["app/extview"]
       });
    })

})()