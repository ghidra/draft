draft.nodes.html={};
draft.nodes.css={};
draft.nodes.js={};

draft.include_nodes={
	lib:[
		"html/terminal",
		"html/generic"
	],
	include:function(src){
		document.write('<script type="text/javascript" language="javascript" src="'+src+'"></script>');
	},
	complete_links:function(path,links){
		for(var i=0;i<links.length;i++){
			links[i]="draft/nodes/"+path+links[i]+".js";
		}
	},
	load_libraries:function(){
		this.complete_links("",this.lib);
		for(var i in this.lib){
			this.include(this.lib[i]);
		}
	}
}
draft.include_nodes.load_libraries();