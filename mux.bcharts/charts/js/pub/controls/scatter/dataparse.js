KISSY.add('mux.bcharts/charts/js/pub/controls/scatter/dataparse',function(S,Base,Node){
	var $ = Node.all

	function DataParse(){
		
		var self = this

		DataParse.superclass.constructor.apply(self,arguments);
	}

	DataParse.ATTRS = {
		o:{
			value:{
				key:{                    //突出显示
					indexs:''                //String 索引字符串[1,2,3]                             ->DataFrameFormat.key.indexs
				},
				vertical:{               //纵轴
					name:'',                 //名称[维度1]                                          ->DataFrameFormat.vertical.name
					data:[]                  //原始二维数据[256,10,432,379...100]                   ->DataFrameFormat.vertical.org
				},
				horizontal:{             //横轴
					name:'',                 //名称[维度2]                                          ->DataFrameFormat.horizontal.name
					data:[]                  //原始数据[1000,2000,3000,4000...38000]                ->DataFrameFormat.horizontal.org
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
			var __indexAxis = xmlDoc.getElementsByTagName("indexAxis")[0]
			var __key = __indexAxis.getElementsByTagName('key')[0]
			var __sets = xmlDoc.getElementsByTagName("sets")[0]
			var __set = __sets.getElementsByTagName("set")[0]

			//防止没有key节点
			o.key.indexs = __key && String(__key.getAttribute('indexs')) ? String(__key.getAttribute('indexs')) : o.key.indexs

			//__sets.getAttribute('name') 当没有name属性时 防止null
			o.vertical.name = __sets.getAttribute('name') && String(__sets.getAttribute('name')) ? String(__sets.getAttribute('name')) : o.vertical.name
			o.vertical.data = __set.getAttribute('values') ? String(__set.getAttribute('values')).split(',') : o.vertical.data
			o.horizontal.name = __indexAxis.getAttribute('name') && String(__indexAxis.getAttribute('name')) ? String(__indexAxis.getAttribute('name')) : o.horizontal.name
			o.horizontal.data = __indexAxis.getAttribute('labels') ? String(__indexAxis.getAttribute('labels')).split(',') : o.horizontal.data
			return o
		}
	});

	return DataParse;

	}, {
	    requires:['base','node']
	}
);