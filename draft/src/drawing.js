draft.drawing=function(){
	return this.init();
}
draft.drawing.prototype.init=function(x,y){

	this.p = new rad.vector2(x,y);
	this.p_prescalled = new rad.vector2(x,y);//store values durring scalling calculations
	this.p_scalled = new rad.vector2();//store the mouse position value before scaling
	this.offset = new rad.vector2();//offset vector

	this.scl = 1.0;

	this.w=20;
	this.h=20;
	this.bottomcorner=new rad.vector2();

	this.margin = 6;

	return this;
}
draft.drawing.prototype.draw_shape=function(){
	var r = this.margin*this.scl;//radius of rounder corners
	var seg = Math.ceil(r*0.3);
	var coff = r*2;
	var pivot = new rad.vector2(this.p.x+r,this.p.y+r);//{x:this.x+r,y:this.y+r};

	draft.context.beginPath();
	this.draw_rounded_corner(pivot,r,seg,2,true);
	pivot.x = pivot.x+(this.w*this.scl)-coff;
	this.draw_rounded_corner(pivot,r,seg,3);
	pivot.y = pivot.y+(this.h*this.scl)-coff;
	this.draw_rounded_corner(pivot,r,seg,0);
	pivot.x = this.p.x+r;
	this.draw_rounded_corner(pivot,r,seg,1);

	draft.context.closePath();
	draft.context.fill();
	if(this.selected)
		draft.context.stroke();
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

draft.drawing.prototype.near=function(p){
	return (p.x>this.p.x-(this.margin*this.scl) && p.x<(this.p.x+((this.w+this.margin)*this.scl)) && p.y>this.p.y-(this.margin*this.scl) && p.y<(this.p.y+(this.h+this.margin)*this.scl) );
}
draft.drawing.prototype.over=function(p){
	return (p.x>this.p.x && p.x<(this.p.x+(this.w*this.scl)) && p.y>this.p.y && p.y<(this.p.y+(this.h*this.scl)) );
}