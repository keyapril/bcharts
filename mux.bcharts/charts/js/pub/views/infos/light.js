KISSY.add('mux.bcharts/charts/js/pub/views/infos/light',function(S,Base,node,Global,SVGElement,SVGGraphics,EventType){
	
	function Light(){
		
		var self = this

		Light.superclass.constructor.apply(self,arguments);
	}

	Light.ATTRS = {
		element:{
			value:null
		},
		min_radius:{
			value:4
		},
		max_radius:{
			value:7
		},
		max_thickness:{
			value:2
		},
		fill:{
			value:'#555555'
		},
		fill_opacity:{
			value:1
		},

		_max:{
			value:null    
		},
		_min:{
			value:null
		}
	}

	S.extend(Light,Base,{
		init:function(){
			var self = this
			Light.superclass.constructor.apply(self,arguments);
			
			self.set('element', new SVGElement('g')), self.get('element').set('class','light')
			self.get('parent').appendChild(self.get('element').element)
			self.get('element').element.addEventListener("mouseover",function(evt){ self._overHandler(evt)}, false);
			self.get('element').element.addEventListener("mouseout",function(evt){ self._outHandler(evt)}, false);

			self._widget()
		},
		
		_widget:function(){
			var self = this
			self.set('_max', SVGGraphics.circle({'r':self.get('max_radius'),'fill':'#ffffff','fill_opacity':self.get('fill_opacity'),'stroke':self.get('fill'),'stroke_width':self.get('max_thickness')}))
			self.get('element').appendChild(self.get('_max').element)

			self.set('_min', SVGGraphics.circle({'r':self.get('min_radius'),'fill':self.get('fill'),'stroke':'none'}))
			self.get('element').appendChild(self.get('_min').element)
		},

		_overHandler:function($evt){
			var self = this
			self.get('element').fire(EventType.OVER)
		},
		_outHandler:function($evt){
			var self = this
			self.get('element').fire(EventType.OUT)
		}
	});

	return Light;

	}, {
	    requires:['base','node','../../utils/global','../../utils/svgelement','../svggraphics','../../models/eventtype']
	}
);