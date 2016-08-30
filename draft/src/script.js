draft.script=function(id,scr){
        return this.init(id,scr);
}
draft.script.prototype.init=function(id,scr){
    this.id=id;
	this.ids={
        'node':0,
        'line':0,
		'script':0
	}
    this.scale={
        'scale':1.0,
        'start':1.0
    }

	this.nodes = rad.objhasprop(scr.nodes)?scr.nodes:{};
	this.lines = rad.objhasprop(scr.lines)?scr.lines:{};
	this.scripts = rad.objhasprop(scr.scripts)?scr.scripts:{};
}
//----------------
draft.script.prototype.add_node=function(category,name,x,y,sid){
        name = name||"none";
        category = category||"none";
        x = x||10;
        y = y||10;
        sid = sid||this.ids.script;
        var new_node = this.nodes[this.ids.node] = new draft.node(this.ids.node,category,name,x,y,this.scale.scale,sid);
        this.ids.node+=1;
        return new_node;
}
draft.script.prototype.remove_node=function(id){
	delete this.nodes[id];
}
//-------------------
draft.script.prototype.add_line=function(fn,fp,tn,tp,c){
    this.lines[this.ids.line] = new draft.line(this.ids.line,fn,fp,tn,tp,c);
    this.ids.line+=1;
    return this.lines[this.ids.line-1];//give the line to the function calling it
}
draft.script.prototype.remove_line=function(id){
    //only do the port clean up if we are not a mouse dragged line
    if(this.lines[id].fnode>=0 && this.lines[id].tnode>=0)
        this.lines[id].remove(this.id);//we need to update port values
	delete this.lines[id];
}
draft.script.prototype.start_scale=function(){
    this.scale.start=this.scale.scale;
}

draft.script.prototype.find_node=function(category,name,id){
    //i should add the ability to return a list of all the found nodes if no id is sent in
    for (n in this.nodes){
        if ( this.nodes[n].category === category && this.nodes[n].label === name ){
            if(id != undefined){
                return (this.nodes[n] === id)?this.nodes[n]:false;
            }else{
                //if we do not send in an id, we return the first found one
                return this.nodes[n];
            }
        }
    }
}
