draft.script=function(id,scr){
        return this.init(id,scr);
}
draft.script.prototype.init=function(id,scr){
	this.ids={
    'node':0,
    'line':0,
		'script':0
	}

	this.nodes = js.objhasprop(scr.nodes)?scr.nodes:{};
	this.lines = js.objhasprop(scr.lines)?scr.lines:{};
	this.scripts = js.objhasprop(scr.scripts)?scr.scripts:{};
}
//----------------
draft.script.prototype.add_node=function(category,name,x,y){
        name = name||"none";
        category = category||"none";
        x = x||10;
        y = y||10;
        this.nodes[this.ids.node] = new draft.node(this.ids.node,category,name,x,y);
        this.ids.node+=1;
}
draft.script.prototype.remove_node=function(id){
	delete this.nodes[id];
}
//-------------------
draft.script.prototype.add_line=function(fn,fp,tn,tp){
      	this.lines[this.ids.line] = new draft.line(this.ids.line,fn,fp,tn,tp);
        this.ids.line+=1;
}
draft.script.prototype.remove_line=function(id){
	delete this.lines[id];
}
