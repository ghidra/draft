js={}
js.flusharray=function(a){
	while(a.length>0){
                a.pop();
        }
}
js.objhasprop=function(o){
	for(var prop in o) {
    		if (Object.prototype.hasOwnProperty.call(o, prop)) {
      			return true;
    		}
  	}
  	return false;
}
js.objisempty=function(obj){
  for(var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}
js.totype=function(obj){
  //http://stackoverflow.com/questions/7390426/better-way-to-get-type-of-a-javascript-variable
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
js.position=function(obj){
  Element.cumulativeScrollOffset
  var curleft= 0;
  var curtop= 0;
  if(obj.offsetParent){//if the browser suppert this object call, offsetParent
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    }while (obj = obj.offsetParent);
      return {x:curleft,y:curtop};
  }
}
js.relativemouseposition=function(e){
  //return [ e.pointerX(), e.pointerY() ];
  var xp = 0;
  var yp = 0;

  var xo = e.clientX;
  var yo = e.clientY;

  var target = e.currentTarget;

  while (target) {
      xp += (target.offsetLeft - target.scrollLeft + target.clientLeft);
      yp += (target.offsetTop - target.scrollTop + target.clientTop);
      target = target.offsetParent;
    }

  return {x: xo-xp, y: yo-yp};
}
js.mouseposition=function(e){
  return {x:e.clientX,y:e.clientY};
}
js.size=function(obj){
  var w = obj.offsetWidth; 
  var h = obj.offsetHeight;
  return {x:w,y:h};
}
js.remove=function(id){
  var element = document.getElementById(id);
  element.parentNode.removeChild(element);
}
js.bind=function(elem, e, func, bool){
  bool = bool || false;
  if (elem.addEventListener){
    elem.addEventListener(e, func, bool);
  }else if (elem.attachEvent){
    elem.attachEvent('on' + e, func);
  }
}
js.unbind=function(elem, e, func, bool){
  bool = bool || false;
  if (elem.removeEventListener){
    elem.removeEventListener(e, func, bool);
  }else if (elem.detachEvent){
    elem.detachEvent('on' + e, func);
  }
}
js.closure=function(scope, func, arg){
  return function(e){
    func.call(scope,e,arg);
  };
}
js.dragevent=function(move,release){
  document.addEventListener( 'mousemove',move);
  document.addEventListener( 'mouseup',release);
}
js.removedragevent=function(move, release){
  document.removeEventListener('mousemove',move);
  document.removeEventListener('mouseup',release); 
}
//math
js.clamp = function(v,min,max) {
  return Math.min(Math.max(v, min), max);
}
js.remap = function(v,l1,h1,l2,h2){
	return l2 + (v - l1) * (h2 - l2) / (h1 - l1);
}
