KISSY.add('mux.bcharts/charts/js/pub/views/back',function(S,Base,node,Global,SVGElement,SVGRenderer,SVGGraphics){
	
	function Back(){
		
		var self = this

		Back.superclass.constructor.apply(self,arguments);

		// self.init.apply(self,arguments);
	}

	Back.ATTRS = {
		w:{
			value:0
		},
		h:{
			value:0
		},
		h_ver:{
			value:0              //纵轴的高
		},
		w_hor:{
			value:0              //横轴的宽
		},
		element:{
			value:null
		},
		data_ver:{
			value:[]             //纵轴数据集合  [{x:100},{}]
		},
		data_hor:{
			value:[]             //横轴数据集合  [{y:100}.{}]
		},
		line_fill:{
			value:'#D6D6D6'
		},
		line_ver_mode:{          //纵向的线模式(0 = 虚线 | 1 = 实线)
			value:1
		},


		_line_ver:{
			value:null           //纵轴框
		},
		_line_hor:{
			value:null           //横轴框
		},
		_line_w:{ 
			value:1              //线宽
		},
		_df:{
			value:null
		}
	}

	S.extend(Back,Base,{
		init:function(){
			var self = this
			Back.superclass.constructor.apply(self,arguments);
			
			self.set('element', new SVGElement('g')), self.get('element').set('class','back')
			self.get('parent').appendChild(self.get('element').element)

			self._widget()
			self._layout()

		},

		_widget:function(){
			var self = this
			//_line_ver
			// S.log(S.now())
			self.set('_df',document.createDocumentFragment())

			var d = SVGRenderer.symbol('line',0,0,0,-self.get('h')).join(' ')
			self.set('_line_ver', new SVGElement('path'))
		    self.get('_line_ver').attr({'stroke':self.get('line_fill'),'stroke-width':self.get('_line_w'),'d':d})
		    self.get('_df').appendChild(self.get('_line_ver').element)

		    //_line_hor
		    var d = SVGRenderer.symbol('line',0,0,self.get('w'),0).join(' ')
			self.set('_line_hor', new SVGElement('path'))
		    self.get('_line_hor').attr({'stroke':self.get('line_fill'),'stroke-width':self.get('_line_w'),'d':d})
		    self.get('_df').appendChild(self.get('_line_hor').element)
		},
		_layout:function(){
			var self = this
			self.set('h_ver', self.get('h_ver') ? self.get('h_ver') : self.get('h'))
			self.set('w_hor', self.get('w_hor') ? self.get('w_hor') : self.get('w'))
			// S.log(S.now())
			//虚线
			for (var a = 0, al = self.get('data_hor').length; a < al; a++ ) {
				var o = self.get('data_hor')[a]
				var y = o.y

				var line = new SVGElement('line')
				line.attr({'x1':0,'y1':0,'x2':self.get('w_hor'),'y2':0,'stroke':self.get('line_fill'),'stroke-dasharray':'2,3'})
				line.transformY(y)
				self.get('_df').appendChild(line.element)
			}

			//实线
			for (var b = 0, bl = self.get('data_ver').length; b < bl; b++ ) {
				var o = self.get('data_ver')[b]
				var x = o.x

				if(self.get('line_ver_mode') == 0){
					var line = new SVGElement('line')
					line.attr({'x1':0,'y1':0,'x2':0,'y2':-self.get('h_ver'),'stroke':self.get('line_fill'),'stroke-dasharray':'2,3'})
				}else if(self.get('line_ver_mode') == 1){
					var line = new SVGElement('line')
					line.attr({'x1':0,'y1':0,'x2':0,'y2':-self.get('h_ver'),'stroke':self.get('line_fill')})
				}
				line.transformX(x)
				self.get('_df').appendChild(line.element)
			}
			self.get('element').appendChild(self.get('_df'))
			// S.log(S.now())
		}
	});

	return Back;

	}, {
	    requires:['base','node','../utils/global','../utils/svgelement','../utils/svgrenderer','../views/svggraphics']
	}
);