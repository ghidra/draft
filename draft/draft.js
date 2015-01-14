draft={};
draft.includes={
	lib:[
		"js",
		"draft",
		"script",
		"node",
		"port",
		"line",
		"node_files"
	],
	include:function(src){
		document.write('<script type="text/javascript" language="javascript" src="'+src+'"></script>');
	},
	complete_links:function(path,links){
		for(var i=0;i<links.length;i++){
			links[i]="draft/src/"+path+links[i]+".js";
		}
	},
	load_libraries:function(program){
		this.complete_links("",this.lib);
		for(var i in this.lib){
			this.include(this.lib[i]);
		}
		this.include(program);
	}
};
draft.includes.load_libraries('index.js');
