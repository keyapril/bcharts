KISSY.add('mux.bcharts/charts/js/e/integrate/control/dataparse',function(S,Base,Node){
	var $ = Node.all

	function DataParse(){
		
		var self = this

		DataParse.superclass.constructor.apply(self,arguments);
	}

	DataParse.ATTRS = {
		o:{
			value:{
				key:{                    //突出显示[预留]
					indexs:''                //String 索引字符串[1,2,3]                            
				},
				vertical:{               //纵轴	
					names:[],                //名称二维数据[ [千次展现价格:,展现次数:] ]
					data:[]                  //原始三维数据[ [  [[8300],[8100],[...]]   , [[4300],[4100],[...]]   ] ]
				},
				horizontal:{             //横轴
					data:[]                  //原始二维数据[[3月8号],[3月9号],[...]]
				}
			}
		}
	}

	S.extend(DataParse,Base,{
		parse:function($data,$type){
			var o
			var type = $type ? $type : 'xml'
			if(type == 'xml'){
				o = this._xml($data)
			}
			return o
		},

		_xml:function($data){
			var self = this

			var o = S.clone(self.get('o')) 
			var data = String($data)

			var domParser = new DOMParser();
			var xmlDoc = domParser.parseFromString(data, 'text/xml');

			o = self._getObject(xmlDoc.getElementsByTagName("data"))

			return o
		},

		_getObject:function($list){
			var self = this

			var o = S.clone(self.get('o')) 
			var item;

			for (var a = 0, al = $list.length; a < al; a++) {
				var __data = $list[a]
				var __indexAxis = __data.getElementsByTagName("indexAxis")[0]
				var __sets = __data.getElementsByTagName("sets")[0]

				//Q3(js:空的数组判断能通过)
				o.horizontal.data = o.horizontal.data.length > 0 ? o.horizontal.data : __indexAxis.getAttribute('labels') ? String(__indexAxis.getAttribute('labels')).split(',') : []

				o.vertical.names.push(String(__sets.getAttribute('name')).split(',')) 
				o.vertical.data.push(String(__sets.getElementsByTagName('set')[0].getAttribute('values')).split(','))
			}

			return o
		}
	});

	return DataParse;

	}, {
	    requires:['base','node']
	}
);