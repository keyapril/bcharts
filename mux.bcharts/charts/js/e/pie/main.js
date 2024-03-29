KISSY.add('mux.bcharts/charts/js/e/pie/main',function(S,Base,Global,SVGElement,DataParse,ConfigParse,EventType,Widget,List){
	function Main(){

		var self = this

		/*
			arguments:

			  o:{
				parent   :''     //SVGElement
				w        :100    //chart 宽
				h        :100    //chart 高
				config   :''     //图表配置
				data     :''     //图表数据  
			  }

		 */
		Main.superclass.constructor.apply(self,arguments);

		self.init()
	}

	Main.ATTRS = {
		_main:{
			value:null
		},
		_config:{                //图表配置   经过ConfigParse.parse
			value:{}
		},
		_DataSource:{
			value:{}             //图表数据源 经过DataParse.parse
		},
		_data:{
			value:[]             //渲染完之后的数据集合
		},

		_widget:{
			value:null
		},
		_list:{
			value:null
		}
	}

	S.extend(Main,Base,{
		init:function(){
			var self = this
			
			self.set('_DataSource', new DataParse().parse(self.get('data'))) 
			self.set('_config', new ConfigParse().parse(self.get('config'))) 

			self._widget()	
		},

		_widget:function(){
			var self = this
			var config = self.get('_config')   
			
			self.set('_main',new SVGElement('g'))
			self.get('_main').attr({'class':'main'});
			self.get('parent').appendChild(self.get('_main').element)
			self.get('_main').transformXY(Global.N05,Global.N05)

			var w =  self.get('w'), h = self.get('h')
			if(config.list.is){
				w = w - 120
				self.set('_list', new List({parent:self.get('_main')}))
			}

			var o = {}
			o.parent = self.get('_main')                       //SVGElement
			o.w = w                                            //chart 宽
			o.h = h                                            //chart 高
			o.DataSource = self.get('_DataSource')             //图表数据源
			o.config = self.get('_config')                     //图表配置
			self.set('_widget', new Widget(o))
			self.get('_widget').get('element').on(EventType.OVER,function($o){self._overHandler($o)})
			self.get('_widget').get('element').on(EventType.OUT,function($o){self._outHandler($o)})

			if(config.list.is){
				self.set('_data', self.get('_widget').getData())
				
				var o = {
					parent : self.get('_main'),
					data   : self._getInfo()
				}
				self.get('_list').widget(o)
				
				var x = Number(self.get('_widget').getPie().get('element').get('_x')) + Number(self.get('_widget').getPie().get('mw') / 2) + 16
				var y = (h - self.get('_list').get('h')) / 2
				x = Global.ceil(x), y = Global.ceil(y)
				self.get('_list').get('element').transformXY(x, y)
			}
		},

		_getInfo:function(){
			var self = this
			var config = self.get('_config')
			var data = self.get('_data').order
			var arr = []
			for (var a = 0, al = data.length; a < al; a++ ) {
				var o = data[a]
				if(o && o.order){

					if(!config.list.max || config.list.max > a){
						arr[a] = []
						arr[a].push({content:o.name, bold:1, fill:'#333333', size:12, ver_align:3, sign: { has:1, trim:1, fill:o.normal, disX:8}})
						var content = o.scale
						if(config.list.content.mode == 1){
							var content = o.data
						}
						arr[a].push({content:content, bold:1, fill:'#333333', size:12, ver_align:3})
					}
				}
			}
			return arr
		},

		_overHandler:function($o){
			var self = this
			if(self.get('_list')){
				var o = $o
				o.is = 1
				self.get('_list').induce(o)
			}
		},
		_outHandler:function($o){
			var self = this
			if(self.get('_list')){
				var o = $o
				o.is = 0
				self.get('_list').induce(o)
			}
		},
	});

	return Main;

	}, {
	    requires:['base','../../pub/utils/global','../../pub/utils/svgelement','../../pub/controls/pie/dataparse','../../pub/controls/pie/configparse','../../pub/models/eventtype','./view/widget','../../pub/views/list/graphs']
	}
);