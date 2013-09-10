KISSY.add("app/models/basemodel",function(S, MxModel,IO){
    return Model=MxModel.extend({
        parse:function(resp){
            return resp;
        },
        sync:function(options){
            var model=this;
            var gets,
                type = 'GET',
                url = model.url(),
                jsonp = model.get("jsonp"),
                async = model.get("async"),
                data = model.getPostParams(),
                dataType=model.get('dataType')||'json',
                oldSucc = options.success;
            console.log(url);
            var params = {
                url:url,
                type:type,
                data:data,
                dataType:dataType,
                async: async === false ? false : true,
                success:function (data, msg, xhr) {
                    if(dataType=='json'){
                        if (!data.info.ok) {
                            options.error.call(this, data.info.message);
                        } else {
                            oldSucc.call(this, data.data);
                        }
                    }else{
                        try {
                            oldSucc.apply(this, arguments);
                        } catch (e) {//方法执行出错
                            console.log(e);
                            options.error.call(this, e.message, e);
                        }
                    }
                },
                error:function(x,msg){
                    options.error(msg);
                }
            };

            if(jsonp) {
                params.jsonp = (jsonp===true?'_c':jsonp);
                params.dataType = 'jsonp';
                params.type = 'get';
            } else {
                if(data) {
                    data = model.getPostParams();
                    params.data = data;
                    params.type = "POST";
                }else{
                    model.setUrlParams('t',S.now());
                }
            }
            gets = model.getUrlParams();
            if(gets){
                params.url = params.url + (~params.url.indexOf('?') ? '&' : '?') + gets;
            }
            return KISSY.io(params);
        }
    });
},{
    requires:["mxext/model","ajax"]
});
