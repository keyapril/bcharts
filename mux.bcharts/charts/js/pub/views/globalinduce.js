KISSY.add('mux.bcharts/charts/js/pub/views/globalinduce',function(S,Base,node,SVGElement,SVGRenderer){
	
	function GlobalInduce(){
		
		var self = this

		GlobalInduce.superclass.constructor.apply(self,arguments);
	}

	GlobalInduce.ATTRS = {
		w:{
			value:100
		},
		h:{
			value:100
		},
		element:{
			value:null
		},
		opacity:{
			value:1              
		}
	}

	S.extend(GlobalInduce,Base,{
		init:function(){
			var self = this
			GlobalInduce.superclass.constructor.apply(self,arguments);

			self.set('element', new SVGElement('g')), self.get('element').set('class','globalInduce')
			self.get('parent').appendChild(self.get('element').element)

			var induce = new SVGElement('path')
			var w = self.get('w'), h = self.get('h')
			var d = SVGRenderer.symbol('square',0,0,w,h).join(' ')
			induce.attr({'_w':w,'_h':h,'d':d,'opacity':self.get('opacity')})
			self.get('element').appendChild(induce.element)
		}
	});

	return GlobalInduce;

	}, {
	    requires:['base','node','../utils/svgelement','../utils/svgrenderer']
	}
);