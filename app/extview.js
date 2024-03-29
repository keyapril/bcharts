KISSY.add("app/extview", function(S, MV) {

    var ViewModel = function(config) {
        ViewModel.superclass.constructor.call(this, config);
        this.addAttrs(config);
    };

    S.extend(ViewModel, S.Base, {
        /**
         * @lends ViewModel#
         */
        /**
         * 注册datakey
         * @param  {Array} dataKey datakey数组
         */
        registerDataKey: function(dataKey) {
            var o = {};
            for (var i = 0; i < dataKey.length; i++) {
                o[dataKey[i]] = {};
            }
            this.addAttrs(o);
        },
        /**
         * 注册模板帮助方法
         * @param {Object} obj 包含方法的对象
         **/
        registerRenderers: function(obj) {
            var me = this;
            var baseSet = me.constructor.superclass.set;
            for (var group in obj) {
                var groups = obj[group];
                for (var n in groups) {
                    baseSet.call(me, group + '_' + n, (function(f) {
                        return function() {
                            return f.call(this, me._view);
                        }
                    }(groups[n])), {
                        slient: true
                    })
                }
            }
        },
        /**
         * 你懂的
         * @return {Object}
         */
        toJSON: function() {
            return this.getAttrVals();
        } //,
        /**
         * 设置key对应的值
         * @param {String|Object} name  字符串或对象
         * @param {Object} value 值
         * @param {Object} opts
         */
        /*set: function(name, value, opts) {
            var obj = name;
            if (!S.isPlainObject(obj)) {
                obj = {};
                obj[name] = value;
            }
            //console.log(name,value);
            for (var key in obj) {
                if (!this.hasAttr(key)) {
                    throw Error("The DataKey: '" + key + "' has not been registed in current ViewModel!");
                }
            }
            return this.constructor.superclass.set.call(this, name, value, opts);
        }*/
    });

    var Pagelet;
    var WIN = window;
    S.mix(MV.prototype, {
        /**
         * 设置view的pagelet，与brix深度整合
         * @param {Object} data  数据对象
         * @param {Function} ready pagelet就绪后的回调
         * @example
         * //template
         *
         * <div bx-tmpl="x" bx-datakey="x">
         *     {{x}}
         * </div>
         *
         * <div bx-tmpl="xy" bx-datakey="x,y">
         *     {{y}}--{{x}}
         * </div>
         *
         * <div bx-name="xx" bx-config="{}">
         *
         * </div>
         * // view code
         *
         *
         * render:function(){
         *     //...
         *     this.setViewPagelet({
         *         param1:'x',
         *         param2:'y'
         *     },function(pagelet){
         *         var brix=pagelet.getBrick('xx');
         *         //brix....
         *     })
         * }
         */
        setViewPagelet: function(data, ready, config) {
            var me = this;
            var sign = me.sign;
            var getPagelet = function(fn) {
                if (Pagelet) {
                    fn(Pagelet);
                } else {
                    S.use('brix/app', function(S, P) {
                        fn(Pagelet = P);
                    });
                }
            };
            var pagelet = me.getManaged('pagelet');
            if (pagelet) {
                pagelet.setChunkData(data);
            } else {
                getPagelet(function(Pglt) {
                    if (sign == me.sign) {
                        //S.one('#' + me.id).html('');
                        me.beginUpdate();
                        Pglt.boot(S.mix({
                            el: '#' + me.id,
                            tpl: me.wrapMxEvent(me.template),
                            data: me.wrapMustachData(data),
                            destroyAction: 'empty'
                        },config)).then(function(pagelet) {
                            me.manage('pagelet', pagelet);

                            pagelet.on('beforeRefreshTmpl', function(e) {
                                me.owner.unmountZoneVframes(e.node[0]);
                            });
                            pagelet.on('afterRefreshTmpl', function(e) {
                                me.owner.mountZoneVframes(e.node[0], null, true);
                            });
                            pagelet.once('ready', function() {
                                me.endUpdate();
                                if (ready) {
                                    //S.later(function() {
                                    if (sign == me.sign) {
                                        ready.call(me, pagelet);
                                    }
                                    // }, 2000)
                                }
                            });
                        });



                    }
                });
            }
        },
        wrapMustachData: function(data) {
            var self = this,
                rr = this.renderer,
                mcName, wrapperName;
            if (rr) {
                for (mcName in rr) {
                    for (wrapperName in rr[mcName]) {
                        (function() {
                            var mn = mcName,
                                wn = wrapperName;
                            var fn = rr[mn][wn];
                            data[mn + "_" + wn] = function() {
                                return fn.call(this, self, mn);
                            };
                        })();
                    }
                }
            }
            return data;
        },
        mxViewCtor: function() {
            var me = this;
            me.vm = new ViewModel();
            me.vm._view = me;
        }
    });
}, {
    requires: ["mxext/view", "base"]
});