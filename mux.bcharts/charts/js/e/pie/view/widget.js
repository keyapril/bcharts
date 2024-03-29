KISSY.add('mux.bcharts/charts/js/e/pie/view/widget',function(S,Base,Node,Global,DataSection,SVGElement,GlobalInduce,Infos,EventType,Graphs){
	var $ = Node.all

	function Widget(){
		
		var self = this

		/*
			arguments:

			  o:{
				parent    :''     //SVGElement
				w         :100    //chart 宽
				h         :100    //chart 高
				DataSource:{}     //数据源
				config    :{}     //配置
			  }

		 */
		Widget.superclass.constructor.apply(self,arguments);

		self.init()
	}

	Widget.ATTRS = {
		w:{
			value:0
		},
		h:{
			value:0
		},
		element:{
			value:null
		},

		_DataFrameFormat : {
			value:{
				key:{                    //突出显示[预留]
					indexs:'',             //String 索引字符串[1,2,3]
					data  :[]              //Array indexs split之后的数组
				},
				values:{
					names :[],             //原始名称数组
					org   :[],             //原始数据数组(未排序)
					data  :[],             //排序后的数据(大->小 纯org的排序)
					all   :[],             //排序后的数据对象集合[{names:,data:},{}]
					order :[]              //Array  需要list时 排序之后的数据 根据data中的value
				}
			}
		},

		_graphs:{
			value:null                   //图形
		},
		_infos:{
			value:null                   //信息
		},
		_globalInduce:{
			value:null                   //全局感应区
		},
		_induces:{
			value:null                   //感应区
		},

		_dis:{
			value:20                     //上、下、左、右的距离
		},
		_timeoutId:{
			value:0                      
		},
		_timeoutDelay:{
			value:300                    
		},
	}

	S.extend(Widget,Base,{
		init:function(){
			var self = this
			var config = self.get('config')

			self.set('_DataFrameFormat',self.DataExtend(self.get('_DataFrameFormat'),self.get('DataSource'))) 
			if(config.order.mode == 1){
				self.get('_DataFrameFormat').values.data = S.clone(self.get('_DataFrameFormat').values.org).sort(function(a,b){return b-a;}); 
			}else if(config.order.mode == 0){
				self.get('_DataFrameFormat').values.data = S.clone(self.get('_DataFrameFormat').values.org)
			}
			self.get('_DataFrameFormat').values.all = self._trimData()
			self.get('_DataFrameFormat').values.order = self.get('_DataFrameFormat').values.all

			self._widget()
		},

		getData:function(){
			var self = this
			return S.clone(self.get('_DataFrameFormat').values)
		},

		getPie:function(){
			var self = this
			return self.get('_graphs')
		},

		_widget:function(){
			var self = this
			var config = self.get('config')
			self.set('element', new SVGElement('g')), self.get('element').set('class','widget')
			self.get('parent').appendChild(self.get('element').element)

			self.set('_graphs',new Graphs())
			self.set('_infos',new Infos())
			self.set('_globalInduce', new GlobalInduce())
			self.set('_induces',new Graphs())

			var n = parseInt(Math.min(self.get('w'), self.get('h'))) - self.get('_dis')
			var o = {
				x     : parseInt(self.get('w')/2),
				y     : parseInt(self.get('h')/2),
				parent: self.get('element'),
				data  : self.get('_DataFrameFormat').values.data,
				mw    : n,
				mh    : n,
				xr    : n / 2 - config.dis,
				yr    : n / 2 - config.dis,
				tr    : (n / 2 - config.dis) * 0.6,
				isTxt : self.get('config').font.is
			}
			if(self.get('config').fills.normals.length > 0){
				o.fills = self._getArrayForObjectPro(self.get('_DataFrameFormat').values.all,'normal')
				o.fills_over = self._getArrayForObjectPro(self.get('_DataFrameFormat').values.all, 'over')
			}
			self.get('_graphs').init(o)
			self.get('_graphs').get('element').transformXY(parseInt(self.get('w')/2),parseInt(self.get('h')/2))

			self.get('_infos').init({parent:self.get('element')})

			var o = {
				w     : self.get('w'),
				h     : self.get('h'),
				parent: self.get('element'),
				opacity : Global.N00001
				// opacity : 0.1
			}
			self.get('_globalInduce').init(o)

			var o = {
				x     : parseInt(self.get('w')/2),
				y     : parseInt(self.get('h')/2),
				parent: self.get('element'),
				id    : 'induces',
				data  : self.get('_DataFrameFormat').values.data,
				isInduce   : 1,
				mw    : n,
				mh    : n,
				xr    : n / 2 - config.dis,
				yr    : n / 2 - config.dis,
				tr    : (n / 2 - config.dis) * 0.6
			}
			if(self.get('config').fills.normals.length > 0){
				o.fills = self._getArrayForObjectPro(self.get('_DataFrameFormat').values.all,'normal')
				o.fills_over = self._getArrayForObjectPro(self.get('_DataFrameFormat').values.all, 'over')
			}
			self.get('_induces').init(o)
			self.get('_induces').get('element').on(EventType.OVER,function($o){self._overHandler($o)})
			self.get('_induces').get('element').on(EventType.MOVE,function($o){self._moveHandler($o)})
			self.get('_induces').get('element').on(EventType.OUT,function($o){self._outHandler($o)})
			self.get('_induces').get('element').transformXY(parseInt(self.get('w')/2),parseInt(self.get('h')/2))
		},

	 	_trimData:function(){
	 		var self = this
	 		var config = self.get('config')
			var arr = []
			for (var a = 0, al = self.get('_DataFrameFormat').values.org.length; a < al; a++ ) {
				var o = { }
				o.name = self.get('_DataFrameFormat').values.names[a]
				o.data = Number(self.get('_DataFrameFormat').values.org[a])
				if(self.get('config').fills.order == 1){
					o.normal = self.get('config').fills.normals[a] ? self.get('config').fills.normals[a] : ''
					o.over = self.get('config').fills.overs[a] ? self.get('config').fills.overs[a] : ''
				} 
				arr.push(o)
			}
			
			if(config.order.mode == 1){
				arr.sort(function(o1,o2){return o1.data < o2.data})
			}

			for(var b = 0, bl = arr.length; b < bl; b++ ) {
				var o  = arr[b]
				if(self.get('config').fills.order == 0){
					o.normal = self.get('config').fills.normals[b] ? self.get('config').fills.normals[b] : ''
					o.over = self.get('config').fills.overs[b] ? self.get('config').fills.overs[b] : ''
				}
			}
			if(self.get('config').list.is){
				var values = self.get('_DataFrameFormat').values.data
				var scales = Global.getArrScales(values)
				for(var c = 0, cl = arr.length; c < cl; c++ ) {
					var o  = arr[c]
					o.order = c + 1
					o.scale = scales[c] + '%'
				}
			}
			if(self.get('config').font.is == 0){
				self.get('config').dis = 0
			}
			return arr
		},

		//从一个对象数组中提取 相同对象属性的值组合成数组 并返回
		_getArrayForObjectPro:function($arr,$pro) {
			var arr = []
			for (var a = 0, al = $arr.length; a < al; a++ ) {
				var o = $arr[a]
				arr.push(o[$pro])
			}
			return  arr
		},

		_overHandler:function($o){
			this.get('_graphs').induce({index:$o.index},true)
			this.get('element').fire(EventType.OVER,$o)
		},
		_moveHandler:function($o){
			clearTimeout(this.get('_timeoutId'));
			var index = $o.index
			var x = Number($o.x)// + Number(this.get('_graphs').get('element').get('_x'))
			var y = Number($o.y)// + Number(this.get('_graphs').get('element').get('_y'))
			// debugger;			
			var base_fill = $o.fill_over
			var data = []
			data[0] = []
			var o = { }
			o.content = this.get('_DataFrameFormat').values.all[index].name + '  '
			data[0].push(o)
			o = { }
			o.content = $o.contents
			data[0].push(o)

			var o = {
				w    : this.get('w'),
				h    : this.get('h'),
				parent : this.get('element'),

				info:{
					x    : x,
					y    : y,
					data : data,
					base_fill : base_fill
				},
				hLine:{
					is   : 0
				},
				hInfo:{
					is   : 0
				}
			}

			this.get('_infos').update(o)
		},
		_outHandler:function($o){
			var self = this
			this.set('_timeoutId', setTimeout(function(){self._outTimeout()}, self.get('_timeoutDelay')))

			this.get('_graphs').induce({index:$o.index},false)
			this.get('element').fire(EventType.OUT,$o)
		},
		_outTimeout:function(){
			this.get('_infos').remove()
		},
		/**
		 * 数据继承
		 * @type {Object}
		 */
		DataExtend:function(DataFrameFormat,DataSource){
			// DataFrameFormat.key.indexs = DataSource.key.indexs
			DataFrameFormat.values.names = DataSource.values.names
			DataFrameFormat.values.org = DataSource.values.data

			return DataFrameFormat
		}
	});

	return Widget;

	}, {
	    requires:['base','node','../../../pub/utils/global','../../../pub/utils/datasection','../../../pub/utils/svgelement','../../../pub/views/globalinduce','../../../pub/views/infos/infos','../../../pub/models/eventtype','../../../pub/views/pie/graphs'
	    ]
	}
);