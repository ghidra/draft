draft.drawing=function(){
	return this.init();
}
draft.drawing.prototype.init=function(){
	this.scl = 1.0;

	this.w=0;
	this.h=0;
	this.bottomcorner=new rad.vector2();

	return this;
}
draft.drawing.prototype.draw_rounded_corner=function(position,radius,segments,corner,start){
	start=start||false;
    var c = 2*3.1415;
   	for (var i =0; i<=segments; i++){
    	var s = (((i+(segments*corner))/segments)/4);
    	var x = (Math.cos(s*c))*radius;
    	var y = (Math.sin(s*c))*radius;
    	if(i===0 && start){
    	    draft.context.moveTo(x+position.x, y+position.y);
    	}else{
    	    draft.context.lineTo(x+position.x,y+position.y);
    	}
	}
}