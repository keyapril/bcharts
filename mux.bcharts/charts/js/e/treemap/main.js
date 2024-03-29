KISSY.add('mux.bcharts/charts/js/e/treemap/main', function(S, Base, d3) {
	function Main() {
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
		Main.superclass.constructor.apply(self, arguments);
		self.init()
	}

	Main.ATTRS = {
		_main: {
			value: null
		},
		_config: { //图表配置   经过ConfigParse.parse
			value: {}
		},
		_DataSource: {
			value: {} //图表数据源 经过DataParse.parse
		}
	}

	S.extend(Main, Base, {
		init: function() {
			var self = this

			// self.set('_DataSource', new DataParse().parse(self.get('data'))) 
			// self.set('_config', new ConfigParse().parse(self.get('config'))) 

			self._widget()
		},

		_widget: function() {
			var self = this
			var w = self.get('w'),
				h = self.get('h'),
				x = d3.scale.linear().range([0, w]),
				y = d3.scale.linear().range([0, h]),
				color = d3.scale.category20c(),
				root,
				node;
			var treemap = d3.layout.treemap()
				.round(false)
				.size([w, h])
				.sticky(true)
				.value(function(d) {
				return d.size;
			});

			var svg = d3.select(self.get('parent').element).append("svg:g").attr("transform", "translate(.5,.5)");


			node = root = self.get('data');

			var nodes = treemap.nodes(root).filter(function(d) {
				return !d.children;
			});

			var cell = svg.selectAll("g").data(nodes).enter().append("svg:g").attr("class", "cell").attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			}).on("click", function(d) {
				return zoom(node == d.parent ? root : d.parent);
			});
			cell.append("svg:title").text(function(d) {
				return d.name;
			});
			cell.append("svg:rect").attr("width", function(d) {
				return d.dx;
			}).attr("height", function(d) {
				return d.dy;
			}).style("fill", function(d) {
				return color(d.parent.name);
			});

			cell.append("svg:text").attr("x", function(d) {
				return d.dx / 2;
			}).attr("y", function(d) {
				return d.dy / 2;
			}).attr("dy", ".35em").attr("text-anchor", "middle").text(function(d) {
				return d.name;
			}).style("visibility", function(d) {
				d.w = this.getComputedTextLength();
				return d.dx > d.w ? 'visible' : 'hidden';
			});

			function zoom(d) {
				var kx = w / d.dx,
					ky = h / d.dy;
				x.domain([d.x, d.x + d.dx]);
				y.domain([d.y, d.y + d.dy]);

				var t = svg.selectAll("g.cell").transition().duration(d3.event.altKey ? 7500 : 750).attr("transform", function(d) {
					return "translate(" + x(d.x) + "," + y(d.y) + ")";
				});

				t.select("rect").attr("width", function(d) {
					return kx * d.dx;
				}).attr("height", function(d) {
					return ky * d.dy;
				})

				t.select("text").attr("x", function(d) {
					return kx * d.dx / 2;
				}).attr("y", function(d) {
					return ky * d.dy / 2;
				}).style("visibility", function(d) {
					return kx * d.dx > d.w ? 'visible' : 'hidden';
				});

				node = d;
			}
		}
	});
	return Main;
}, {
	requires: ['base', './view/widget']
});