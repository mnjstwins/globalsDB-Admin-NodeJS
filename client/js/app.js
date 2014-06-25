var dataAdaptor=new function(){var a="___$",b="___J",c=this,d={},e={root:{___$:"Welcome!",Welcome:"Log in",To:"",The:"",Globals:"Please",Admin:""}},f=function(a){var b=a.slice().pop(),c=g(a.slice(0,a.length-1));c&&(l(a,!1),c.hasOwnProperty(b)&&(c[b]={}))},g=function(a){var b=-1,c=e;do b++,a[b]&&(c=c[a[b]]),"object"!=typeof c&&(c=null);while(a[b]&&c);return c},h=function(a,b){var c=g(a);return c&&a&&b?void(c.hasOwnProperty(b)||(c[b]={})):void console.error("Wrong server data flow.")},i=function(a){var b=g(a.slice(0,a.length-1)),c=a.pop();b.hasOwnProperty(c)?delete b[c]:console.log("Unable to delete from tree ",a)},j=function(b,c){var d=g(b);"object"==typeof d?d[a]=c:console.error("Make sure you're on a right way.")},k=function(a){var b=a.join(",");return d.hasOwnProperty(b)},l=function(a,b){var c=a.join(",");if(b?d[c]=1:d.hasOwnProperty(c)&&delete d[c],!b)for(var e in d)d.hasOwnProperty(e)&&0===e.indexOf(c)&&delete d[e]},m=new function(){this.requestNodeValue=function(a){var b=a.slice(1),d={pathArray:b};server.send({request:"getNode",data:d},function(e){return e&&!e.error&&e.result?(j(a,e.result.data),void c.nodeValueUpdated(b)):void console.error("Sever data error: ",{request:d,data:e})})},this.requestLevelData=function(a,d){if(!k(a)){var e=a.slice(1),f=0,i={pathArray:e,max:50},j=g(a);j.hasOwnProperty(b)&&(i.lo=j[b]),d&&(i.lo=d),server.send({request:"getLevel",data:i},function(b){if(!b||b.error||!b.result)return void console.error("Sever data error: ",b);for(var d in b.result)b.result.hasOwnProperty(d)&&(h(a,b.result[d].name),f++);f<i.max&&l(a,!0),c.childUpdated(e)})}}};this.forceClear=function(a){f(a),l(a,!1),c.childUpdated(a.slice(1))},this.childUpdated=function(){},this.nodeValueUpdated=function(){},this.getLevel=function(c,d,f){var g,h=-1,i=e,j=[],k="";d||(d=1/0);do h++,c[h]&&(i=i[c[h]]),"object"!=typeof i&&(i=null);while(c[h]&&i);for(g in i)if(i.hasOwnProperty(g)&&g!==a&&g!==b){if(f){if(g!==f)continue;f=!1}if(!(d>0))break;d--,j.push(g),k=g}return d>0&&m.requestLevelData(c,k),j},this.getValue=function(b){if(!(b instanceof Array))return"";for(var c=e,d=0;b[d]&&"object"==typeof c;)c=c[b[d]],d++;return"object"==typeof c&&"undefined"==typeof c[a]&&m.requestNodeValue(b),"object"==typeof c?"undefined"==typeof c[a]?"":c[a]:c},this.setNode=function(a,b,d,e){var f=a.concat(b),g=f.slice(1);server.send({request:"setNode",data:{pathArray:g,data:d}},function(i){i&&!i.error?(h(a,b),j(f,d),c.childUpdated(a.slice(1)),c.nodeValueUpdated(g),"function"==typeof e&&e(!0)):(console.log("Wrong response",i),"function"==typeof e&&e(!1))})},this.copyNode=function(a,b,d){var e=a.slice(1),f=b.slice(1);server.send({request:"copyNode",data:{fromPathArray:e,toPathArray:f}},function(a){a&&!a.error?(h(b.slice(0,b.length-1),b[b.length-1]),c.childUpdated(f.slice(0,f.length-1)),"function"==typeof d&&d(!0)):(console.log("Wrong response",a),"function"==typeof d&&d(!1))})},this.deleteNode=function(a,b){server.send({request:"killNode",data:{pathArray:a.slice(1)}},function(d){d&&!d.error?(i(a),c.childUpdated(a.slice(1)),"function"==typeof b&&b(!0)):(console.log("Wrong kill request.",d),"function"==typeof b&&b(!1))})},this.setJumper=function(a,d){var e=g(a);e&&(l(a,!1),d?(f(a),e=g(a),e[b]=d,c.childUpdated(a.slice(1))):(e.hasOwnProperty(b)&&delete e[b],f(a),c.childUpdated(a.slice(1))))},this.reset=function(a){e.root={___$:a||"root"},d={}}},Geometry={normalizeAngle:function(a){return(a+2*Math.PI)%(2*Math.PI)},angleDifference:function(a,b){return Math.atan2(Math.sin(b-a),Math.cos(b-a))}},THEMES=["classic","sketch","sunrise"],app=new function(){var a,b={VIEWPORT:null,FIELD:null,TREE_PATH:null},c=!1,d=dataAdaptor,e=null,f="1.3.0",g=!0,h=!0,i="node",j="link",k="selected",l="deleting",m="copying",n="editing",o="",p=0,q=1,r=2,s=3,t=4,u=15,v=110,w=140,x=80,y=0,z=null,A=null,B=0,C=1,D=2,E=function(a){a.preventDefault(),a.cancelBubble=!0,a.preventDefault&&(a.preventDefault(),a.stopPropagation())},F=function(){b.VIEWPORT=document.getElementById("fieldViewport"),b.FIELD=document.getElementById("field"),b.TREE_PATH=document.getElementById("treePath")},G=function(){var a,b=document.createElement("p"),c={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"};document.body.insertBefore(b,null);for(var d in c)c.hasOwnProperty(d)&&void 0!==b.style[d]&&(b.style[d]="translate3d(1px,1px,1px)",a=window.getComputedStyle(b,null).getPropertyValue(c[d]));return document.body.removeChild(b),void 0!==a&&a.length>0&&"none"!==a},H=function(){var c=this,d=window.innerWidth,f=window.innerHeight,h=0,i=0,j=0,k=0,l=0,m=0,n=1,o=1e5,p=1e5,q=.3,r=3,s=0,t={ox:0,oy:0,x:0,y:0,target:null,event:null,pressed:!1};this.getRelativeCenter=function(){return{x:o/2,y:p/2}},this.getViewX=function(){return h-o/2},this.getViewY=function(){return i-p/2},this.scaleView=function(a){var d=b.FIELD;n+=a,n=Math.max(q,Math.min(r,n)),c.setViewCenter(l,m),v(),d.style.transform=d.style["-ms-transform"]=d.style["-o-transform"]=d.style["-moz-transform"]=d.style["-webkit-transform"]="scale("+n+")"},this.setViewCenter=function(a,b){l=a,m=b,h=o/2+a*n-d/2,i=p/2+b*n-f/2,s||(s=setInterval(u,25))};var u=function(){var a,c;j+=a=(h-j)/2,k+=c=(i-k)/2,Math.abs(a)+Math.abs(c)<.001&&(clearInterval(s),s=0,j=h,k=i),b.VIEWPORT.scrollLeft=Math.round(j),b.VIEWPORT.scrollTop=Math.round(k)},v=function(){j=h,k=i,u()},w=new function(){var a,b=0,e=function(){var b=a;if(b.scrolling){var d=b.scrolling.parentNode,e=-Math.atan2(b.x-b.ox,b.oy-b.y)+Math.PI/2,f=Geometry.angleDifference(e,b.scrolling.angle);return d.childController.updateSelectedIndex(-f),b.scrolling.angle=e,void(Math.abs(f)<.001&&h())}if(!b.event.changedTouches||b.event.changedTouches.length<2);else{var g=Math.sqrt(Math.pow(b.event.changedTouches[0].pageX-b.event.changedTouches[1].pageX,2)+Math.pow(b.event.changedTouches[0].pageY-b.event.changedTouches[1].pageY,2));b.ld&&(b.i++,c.scaleView((g-b.ld)/100)),b.ld=g}c.setViewCenter(b.ovx+(b.ox-b.x)/n,b.ovy+(b.oy-b.y)/n)},g=function(){b||(clearInterval(b),b=setInterval(e,30))},h=function(){clearInterval(b),b=0};this.started=function(a){a.ox=a.x,a.oy=a.y,a.i=0,a.ld=void 0,a.ovx=(c.getViewX()+d/2)/n,a.ovy=(c.getViewY()+f/2)/n,a.scrolling=null;var b=a.target;do{if(b.NODE_OBJECT){var e;try{e=b.NODE_OBJECT.getParent()}catch(a){e=null}if(e&&!e.childController.isFreeAligned()){a.scrolling={currentNode:b.NODE_OBJECT,parentNode:e,angle:0};var g=-Math.atan2(b.NODE_OBJECT.getX()-e.getX(),e.getY()-b.NODE_OBJECT.getY())+Math.PI/2,h=Math.sqrt(Math.pow(b.NODE_OBJECT.getX()-e.getX(),2)+Math.pow(b.NODE_OBJECT.getY()-e.getY(),2));a.scrolling.angle=g,a.ox=a.ox-Math.cos(g)*h*n,a.oy=a.oy+Math.sin(g)*h*n}}b=b.parentNode}while(b)},this.moved=function(b){E(b.event),a=b,g()},this.ended=function(a){E(a.event),h()}},x=new function(){var a={},b=1,d=0;this.keyPress=function(d,f){a[d]=b;var g=function(a){e&&e.scrollEvent(a)};switch(d){case 8:e&&e.backEvent(),E(f);break;case 13:e&&e.triggerEvent();break;case 37:e&&e.changeStateAction(-1);break;case 38:g(-1);break;case 39:e&&e.changeStateAction(1);break;case 40:g(1);break;case 107:c.scaleView(.1);break;case 109:c.scaleView(-.1)}},this.keyRelease=function(b){a[b]=d}};this.viewportUpdated=function(){d=window.innerWidth,f=window.innerHeight},this.resetViewport=function(){b.FIELD.style.width=o+"px",b.FIELD.style.height=p+"px",c.setViewCenter(0,0),j=h,k=i},this.initialize=function(){a.viewportUpdated(),c.resetViewport();var d=function(a){var b=(a.touches||a.changedTouches||[a])[0];b&&(t.x=b.pageX,t.y=b.pageY,t.event=a,t.target=a.target||a.srcElement)};b.VIEWPORT.ontouchstart=function(a){g&&(t.pressed=!0,d(a),w.started(t))},b.VIEWPORT.ontouchmove=function(a){g&&(d(a),w.moved(t))},b.VIEWPORT.ontouchend=function(a){g&&(t.pressed=!1,d(a),w.ended(t))},b.VIEWPORT.onmousedown=function(a){g&&(t.pressed=!0,d(a),w.started(t))},b.VIEWPORT.onmousemove=function(a){g&&t.pressed&&(d(a),w.moved(t))},b.VIEWPORT.onmouseup=function(a){g&&(t.pressed=!1,d(a),w.ended(t))},b.VIEWPORT.onmousewheel=function(a){g&&c.scaleView(-(a.deltaY||a.wheelDelta)/2e3)},document.body.onkeydown=function(a){g&&x.keyPress(a.keyCode,a)},document.body.onkeyup=function(a){g&&x.keyRelease(a.keyCode,a)}}},I=function(f,g,j,z,E){var F=this,G=f instanceof I?f:null,H=[],K="",L={x:0,y:0,r:0,relativeX:a.getRelativeCenter().x,relativeY:a.getRelativeCenter().y,baseAngle:j},M="",N=null,O=p;this.setPosition=function(a,b){L.x=a,L.y=b,S()},this.setRadius=function(a){L.r=a,S()},this.setChild=function(a){if(a instanceof I){for(var b in H)if(H.hasOwnProperty(b)&&H[b]===a)return;H.push(a)}},this.setValue=function(a){M=a;try{N.childNodes[0].childNodes[0].innerHTML=M}catch(b){console.error("Unable to set value to node DOM element",b)}},this.setIndex=function(a){K=a,F.updateValue()},this.setZIndex=function(a){N&&(N.style.zIndex=a)},this.setBaseAngle=function(a){L.baseAngle=a},this.changeStateAction=function(a){O=Math.round(O+t+a)%t,F.childController.updateView()},this.getX=function(){return L.x},this.getY=function(){return L.y},this.getR=function(){return L.r},this.getParent=function(){return G},this.getIndex=function(){return K},this.getBaseAngle=function(){return j},this.getStateAction=function(){return O},this.getPath=function(){for(var a=[K],b=G;b;)a.unshift(b.getIndex()),b=b.getParent();return a},this.getChildNode=function(a){return F.childController.getChildNodeByIndex(a)},this.childController=new function(){var a=this,b=F,c=[],f={},g=0,i=u,j=30,t=0,w=0,x=0,y=!1,z=!0,E=function(){c[-1]=void 0,c[-2]=void 0,c[-3]=void 0;var a={name:"jump",value:'<img src="img/jumpIcon.png" class="jumpIcon"/>',trigger:C},b={name:"add",value:'<img src="img/addIcon.png" class="addIcon"/>',trigger:B},d={name:"paste",value:'<img src="img/copyIcon.png" class="copyIcon">',trigger:D};z?(g=1,c[-1]=b,c[-2]=d):(g=2,c[-1]=b,c[-2]=a,c[-3]=d),A&&g++,A&&!y&&(y=!0,K())};this.getChildNodeByIndex=function(a){var b;for(var c in f)if(f.hasOwnProperty(c)&&(b=f[c].beam.getNode(),b.getIndex()===a))return b;return null},this.isFreeAligned=function(){return z},this.getCurrentNode=function(){return a.getChildNodeByIndex(c[Math.round(t)])},this.triggerEvent=function(){if(f[Math.round(t)]){switch((0>t||z&&c.length<=t)&&(O=p),O){case p:w=t,a.handleSelect();break;case q:a.handleEdit();break;case r:a.handleCopy(),E();break;case s:a.handleDelete();break;default:console.log("Unhandled action: "+O)}a.forceViewUpdate()}};var H=function(a){switch(a){case B:e.handler.addNode();break;case C:e.handler.jumpNode();break;case D:e.handler.pasteNode(F.getPath());break;default:console.log("Unrecognised trigger")}};this.handleSelect=function(){var a=f[Math.round(t)].beam,b=a.getNode(),c=b.getIndex();return"object"==typeof c&&"undefined"!=typeof c.trigger?void H(c.trigger):(a.setRadius(2.5*a.getInitialRadius()),b.initChild(),void e.setTriggeringNode(b))},this.handleEdit=function(){var b=a.getCurrentNode();b&&e.handler.editNode(b.getPath())},this.handleCopy=function(){var b=a.getCurrentNode();b&&e.handler.copyNode(b.getPath())},this.handleDelete=function(){var b=a.getCurrentNode();b&&(h?confirm("Are you sure to delete "+b.getIndex()+"?")&&e.handler.deleteNode(b.getPath()):e.handler.deleteNode(b.getPath()))},this.updateSelectedIndex=function(b){var d=t;if(z)t=(t+b+c.length+g)%(c.length+g);else if(t=Math.max(-g,Math.min(c.length-1,t+b)),d!==t)try{f[Math.round(d)].beam.setRadius(f[Math.round(d)].beam.getInitialRadius()),f[Math.round(d)].beam.getNode().childController.removeBeams()}catch(e){}t+i/2>c.length&&I(),d!==t&&(z?a.updateView():K())},this.targetSelectionToSubPath=function(b){for(var c in f)if(f.hasOwnProperty(c)&&f[c].beam.getSubPath()===b)return a.updateSelectedIndex(f[c].index-t),f[c].index;return 0},this.removeBeams=function(){for(var a in f)f.hasOwnProperty(a)&&(f[a].beam.remove(),delete f[a])},this.update=function(){c.length;I(),K(),a.updateSelectedIndex(0)};var I=function(){var a=t-Math.ceil(i/2),e=d.getLevel(b.getPath(),j,0>=a?"":c[a]);0>a&&(a=0);for(var g=0;g<e.length;g++)c[a+g]=e[g];if(c.splice(a+g,c.length-a-g),z&&e.length+a-1>i/(G?2:1)){z=!1;for(var h in f)f.hasOwnProperty(h)&&(f[h].beam.setRadius(0),f[h].beam.resetInitialRadius());K()}E()},K=function(){if(z){var d,e=function(){for(var a in f)if(f.hasOwnProperty(a)){f[a].beam.setRadius(f[a].beam.getInitialRadius()),f[a].beam.resetInitialRadius();var b=f[a].beam.getNode();b&&b.childController.removeBeams()}};for(var h in f)f.hasOwnProperty(h)&&f[h].beam.getSubPath()!=c[f[h].index]&&(f[h].beam.remove(),d=!0,delete f[h]);for(var j=0;j<c.length+g;j++)f[j]||(d=!0,f[j]={index:j,beam:new J(b,j<c.length?c[j]:c[c.length-j-1],0,0)});d&&e()}else{var k,l,m=Math.max(Math.ceil(t-i/2),-g),n=Math.min(Math.floor(t+i/2),c.length),o=[];for(k in f)f.hasOwnProperty(k)&&(m>k||k>=n)&&(o.push(f[k]),delete f[k]);for(k=m;n>k;k++){if(f.hasOwnProperty(k.toString())){if("object"!=typeof f[k].beam.getSubPath()){f[k].beam.getSubPath()!==c[f[k].index]&&c[f[k].index]&&f[k].beam.setSubPathName(c[f[k].index]);continue}f[k].beam.remove()}o.length?(l=o.pop(),l.beam.setSubPathName(c[k]),l.index=k,f[k]=l):f[k]={index:k,beam:new J(b,c[k],0,0)}}for(k=0;k<o.length;k++)o[k].beam.remove()}a.forceViewUpdate(),a.updateView()};this.updateView=function(){return z?(N(),void(x=0)):void(x||(x=setInterval(P,25)))},this.forceViewUpdate=function(){return z?(N(),void(x=0)):(clearInterval(x),x=0,void P())};var M=function(){switch(O){case p:return k;case q:return n;case r:return m;case s:return l;default:return o}},N=function(){var a,d,e,h,i=0,j=c.length+g,k=void 0!==L.baseAngle?1:0;for(var l in f)if(f.hasOwnProperty(l)){k?(h=0,e=Math.PI,e=Math.min(e,Math.PI/6*j),d=e/(j||1)):(h=1/j*2*Math.PI/2,e=2*Math.PI-1/j*2*Math.PI,d=e/(j||1)),a=Geometry.normalizeAngle((L.baseAngle||0)+Math.PI-(j>1?e/2:0)+i/(j-1||1)*e-h)||0;var m;f[l].beam.getInitialRadius()||(m=Math.max(f[l].beam.getNode().getR()/Math.tan(d/2),f[l].beam.getNode().getR()+b.getR()+v),1/0===m&&(m=f[l].beam.getNode().getR()+b.getR()+v)),f[l].beam.updateGeometry(a,m||f[l].beam.getRadius(),void 0,Math.round(t)===f[l].index?M():o),i++}},P=function(a){var c,d;a||(a=2.5),w+=c=(t-w)/a,Math.abs(c)<.001&&(w=t,clearInterval(x),x=0);for(var e in f)f.hasOwnProperty(e)&&(d=f[e].index-w,f[e].beam.updateGeometry(2*Math.atan(Math.PI/1.4*d*2/i*2)+("number"==typeof L.baseAngle?L.baseAngle:Math.PI)+Math.PI,Math.max(f[e].beam.getRadius(),f[e].beam.getNode().getR()/Math.tan(2*Math.PI/i),f[e].beam.getNode().getR()+b.getR()+v),-Math.round(d*d)+200,Math.round(t)===f[e].index?M():o))};a.init=function(){I(),K()}};var P=function(){var a=F.getParent();a&&(a.childController.targetSelectionToSubPath(F.getIndex()),a.childController.triggerEvent())},Q=function(a){a instanceof I&&a.setChild(F)},R=function(){var a=document.createElement("DIV");return a.className=i,a.NODE_OBJECT=F,a.innerHTML="<div><span>"+M+"</span></div>",a.onclick=P,b.FIELD.appendChild(a),a},S=function(){var a=Math.round(L.relativeX+L.x-L.r),b=Math.round(L.relativeY+L.y-L.r);c?N.style.transform=N.style["-ms-transform"]=N.style["-o-transform"]=N.style["-moz-transform"]=N.style["-webkit-transform"]="translate3d("+a+"px, "+b+"px, 0)":(N.style.left=a+"px",N.style.top=b+"px"),N.style.width=N.style.height=2*L.r+"px",y+=1};this.initChild=function(){F.childController.init()},this.back=function(){var a=F.getParent();a&&e.setTriggeringNode(a)},this.remove=function(){N&&N.parentNode.removeChild(N),F.childController.removeBeams()},this.updateValue=function(){F.setValue("object"==typeof K?K.value:d.getValue(F.getPath()))},this.highlight=function(a){N.className=i+" "+a},F.handle={updateChild:function(){F.childController.update()}};var T=function(){Q(G),N=R(),F.setPosition(z,E),F.setRadius(null!=f?x:w),F.setIndex(g),S()};T()},J=function(d,e,f,g){var h={angle:Geometry.normalizeAngle(f||0),r:g||100,relativeX:a.getRelativeCenter().x,relativeY:a.getRelativeCenter().y,initialRadius:g,WIDTH_EXPAND:2,HALF_HEIGHT:3},i=this,l=new I(d,e,Geometry.normalizeAngle(h.angle+Math.PI),0,0),m=null,n=function(){d&&(d.childController.targetSelectionToSubPath(i.getSubPath()),d.changeStateAction(1))},o=function(){var a=document.createElement("DIV");return a.className=j,a.innerHTML="<div><div><div><span>"+("object"!=typeof e?e:e.name)+"</span></div></div></div>",a.onclick=n,b.FIELD.appendChild(a),h.HALF_HEIGHT=parseFloat(a.clientHeight)/2||3,a};this.setAngle=function(a){h.angle=Geometry.normalizeAngle(a),l.setBaseAngle(Geometry.normalizeAngle(h.angle+Math.PI)),q()},this.setRadius=function(a){h.initialRadius||(h.initialRadius=a),h.r=a,q()},this.setZIndex=function(a){m&&(m.style.zIndex=11+a),l&&l.setZIndex(12+a)},this.updateGeometry=function(a,b,c,d){h.angle=Geometry.normalizeAngle(a),l.setBaseAngle(Geometry.normalizeAngle(h.angle+Math.PI)),h.initialRadius||(h.initialRadius=b),h.r=b,c&&m&&(m.style.zIndex=11+c),c&&l&&l.setZIndex(12+c),d&&"object"==typeof l.getIndex()&&"undefined"!=typeof l.getIndex()&&(d=k),m.className=j+" "+d,l&&l.highlight(d),q()},this.remove=function(){m&&m.parentNode.removeChild(m),l&&l.remove()},this.setSubPathName=function(a){e=a;try{m.childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerHTML="object"!=typeof e?e:e.name}catch(b){console.error("Unable to set value to beam DOM element",b)}l.setIndex(a)},this.highlight=function(a){a&&"object"==typeof l.getIndex()&&"undefined"!=typeof l.getIndex()&&(a=k),m.className=j+" "+a,l&&l.highlight(a)},this.resetInitialRadius=function(){h.initialRadius=0},this.getNode=function(){return l},this.getSubPath=function(){return e},this.getParentNode=function(){return d},this.getAngle=function(){return h.angle},this.getRadius=function(){return h.r},this.getInitialRadius=function(){return h.initialRadius};var p=function(){if(d&&l){var a=d.getX()-h.HALF_HEIGHT*Math.cos(h.angle+Math.PI/2),b=d.getY()-h.HALF_HEIGHT*Math.sin(h.angle+Math.PI/2),e=d.getR()-h.WIDTH_EXPAND,f=Math.sqrt(Math.pow(l.getX()-d.getX(),2)+Math.pow(l.getY()-d.getY(),2))-e-l.getR()+2*h.WIDTH_EXPAND,g=m.childNodes[0].childNodes[0];if(!(f>h.WIDTH_EXPAND))return void(m.style.display="none");g.style.display=60>f?"none":"block",m.style.display="block",m.style.width=Math.round(f)+"px",c?(m.style.transform=m.style["-ms-transform"]=m.style["-o-transform"]=m.style["-moz-transform"]=m.style["-webkit-transform"]="translate3d("+(h.relativeX+a+e*Math.cos(h.angle))+"px, "+(h.relativeY+b+e*Math.sin(h.angle))+"px, 0) rotate("+h.angle+"rad)",g.style.transform=g.style["-ms-transform"]=g.style["-o-transform"]=g.style["-moz-transform"]=g.style["-webkit-transform"]="rotate("+(h.angle<Math.PI/2||h.angle>Math.PI+Math.PI/2?0:180)+"deg)"):m.style.visibility="hidden",y+=1}},q=function(){l.setPosition(d.getX()+h.r*Math.cos(h.angle),d.getY()+h.r*Math.sin(h.angle)),p()},r=function(){m=o(),q()};r()},K=function(c){var d=this,e=null,f=null,g=function(){c=c||"ROOT",e=new I(null,"root",void 0,0,0),f=e,e.initChild(),h()},h=function(){var a,e=d.getCurrentPath(),f=e.slice();f[0]=c,b.TREE_PATH.innerHTML='<li onclick="uiController.switchInfoPanel();"><div><div>i</div></div></li>';for(var g=function(a,b){a.onclick=function(a){b&&(d.setTriggeringNode(b),E(a))}},h=0;h<e.length;h++){a=document.createElement("li"),a.innerHTML=f[h];var j=e.slice(1,h+1),k=i(j);g(a,k),b.TREE_PATH.appendChild(a)}},i=function(a){for(var b=e,c=0;c<a.length&&b;c++)b=b.getChildNode(a[c]);return b||null};this.getNodeByPath=i,dataAdaptor.childUpdated=function(a){var b=i(a);b==f&&b&&b.handle.updateChild()},dataAdaptor.nodeValueUpdated=function(a){var b=i(a);b&&b.updateValue()},this.scrollEvent=function(a){f&&f.childController.updateSelectedIndex(a)},this.triggerEvent=function(){f&&f.childController.triggerEvent()},this.backEvent=function(){f&&f.back()},this.getCurrentPath=function(){return f?f.getPath():[]},this.setTriggeringNode=function(b){b instanceof I&&(f=b,a.setViewCenter(b.getX(),b.getY()),h())},this.handler={addNode:function(){uiController.switchAddNodeForm()},editNode:function(a){uiController.switchEditNodeForm(a[a.length-1],dataAdaptor.getValue(a))},copyNode:function(a){A=a,uiController.hint("Copied ["+a.join(" -> ")+"]")},pasteNode:function(a){A&&(z=a,uiController.switchCopyNodeForm(A.join(" -> "),a.join(" -> ")+" -> "))},deleteNode:function(a){var b=a.slice();dataAdaptor.deleteNode(a,function(a){a&&uiController.hint("Node ["+b.join(" -> ")+"] has been deleted.")})},jumpNode:function(){uiController.switchJumpNodeForm()}},this.remove=function(){e&&e.remove(),f=null,e=null},this.changeStateAction=function(a){f&&f.changeStateAction(a)},g()};this.switchControl=function(a){g=a?!0:!1},this.updateViewport=function(){a&&a.viewportUpdated()},this.handle={connectionClose:function(){uiController.showMessage("Connection broken.","Client was disconnected from server."),uiController.switchConnectForm()},addNode:function(a,b){if(e){var c=e.getCurrentPath();c.length&&dataAdaptor.setNode(c,a,b,function(c){c?uiController.hint("Node ["+a+"] created."):uiController.showMessage("Failed to set node","Unable to set node ["+a+"] with value ["+b+"]")})}},editNode:function(a,b){if(e){var c=e.getCurrentPath();if(c.length){var d=e.getNodeByPath(c.slice(1));d&&(d=d.childController.getCurrentNode(),d&&d.getIndex()===a&&dataAdaptor.setNode(c,a,b,function(c){c?uiController.hint("Node ["+a+"] changed."):uiController.showMessage("Failed to set node","Unable to set node ["+a+"] with value ["+b+"]")}))}}},copyNode:function(a){z.push(a),dataAdaptor.copyNode(A,z,function(a){a?(dataAdaptor.forceClear(z),uiController.hint("Pasted: ["+A.join(" -> ")+"] to ["+z.join(" -> ")+"]")):uiController.showMessage("Failed to copy node","Unable to copy node ["+A.join(" -> ")+"] to ["+z.join(" -> ")+"]")})},jumpNode:function(a){dataAdaptor.setJumper(e.getCurrentPath(),a),uiController.hint("Jumper set to ["+a+"]")}},this.resetTreeRoot=function(a,b,c){e&&e.remove(),a&&(d=a),d.reset(c+": "+b),e=new K(b)},this.getDescription=function(a){a('<h1>About</h1><hr/><h3><a target="_blank" href="http://zitros.github.io/globalsDB-Admin-NodeJS">GlobalsDB Admin client</a></h3><div>VERSION: '+f+"</div>"),server.send({request:"about"},function(b){b&&b.result&&!b.error&&a(b.result.result)}),server.send({request:"getManifest"},function(b){var c='<h3>GlobalsDB Admin NodeJS Server adaptor</h3><div style="display: inline-block; margin: 0 auto; text-align: left;">';b=b.manifest||{};for(var d in b)b.hasOwnProperty(d)&&(c+="<div>"+d+": "+b[d]+"</div>");c+="</div>",a(c)})},this.init=function(){uiController.init(),c=G(),F(),a=new H,a.initialize(),e=new K,uiController.switchConnectForm()}},server=new function(){var a,b,c=!1,d=!1,e=4,f=0,g=4e3,h={},i=[],j=[],k=function(b){return b.__id?(i.push({req:b}),void m()):void a.send(JSON.stringify(b))},l=function(){for(var a=new Date,b=0;b<j.length;b++)a-j[b].timestamp>g-25&&(console.warn("Dead request",j[b].req),h.hasOwnProperty(j[b].req.__id)&&(h[j[b].req.__id]({error:1,reason:"Dead request"}),delete h[j[b].req.__id]),clearTimeout(j[b].timeout),j.splice(b,1),f--)},m=function(){uiController.showLoadingAnimation(0!==i.length);for(var b=f,c=0;e>b&&c<i.length;b++,c++){var d=i.splice(0,1)[0];a.send(JSON.stringify(d.req)),j.push({req:d.req,timeout:setTimeout(l,g),timestamp:new Date}),f++}},n=function(){var a;do a=parseInt(Math.random().toString().substr(2));while(h.hasOwnProperty(a));return a},o=function(a){console.log("Connection error! ",a)},p=function(a){b?b.call(window,a):app.handle.connectionClose(),b=void 0},q=function(a){(a||{}).wasClean||console.log("WS event not clean.",a);for(var b in h)h.hasOwnProperty(b)&&(d&&console.log("<< "+b+" << CONNECTION_ABORT"),h[b](!1,{error:1,result:!1,reason:"Dead server."}),delete h[b]);f=0,p(c=!1)},r=function(){p(c=!0)},s=function(a){try{a=JSON.parse(a.data)}catch(b){return void console.error("Error parsing server data.",a.data)}if(a.__id&&h.hasOwnProperty(a.__id)?(d&&console.log("<< "+a.__id+" <<",a),h[a.__id](a),delete h[a.__id]):d&&console.log("<< [not handled] <<",a),a.__id){f--,m();for(var c=0;c<j.length;c++)j[c].req.__id==a.__id&&(clearTimeout(j[c].timeout),j.splice(c,1))}};this.send=function(a,b){if(!c)return 0;if(b&&"function"==typeof b){var e;h[e=n()]=b,a.__id=e,d&&console.log(">> "+e+" >>",a)}else d&&console.log(">>",a);return k(a),1},this.connect=function(d,e,f){if(c)return void f(!1,{error:1,result:!1,reason:"Already connected."});"function"==typeof f&&(b=f);try{a=new WebSocket("ws://"+d+":"+e)}catch(g){var h={reason:"Wrong url",wasClean:!1};return o(h),void q(h)}a.onopen=r,a.onerror=o,a.onclose=q,a.onmessage=s},this.disconnect=function(){c&&a.close()},this.connected=function(){return c}},uiController=new function(){var a=this,b=null,c=!1,d="hint",e={infoBar:null,connect:null,login:null,message:null,addNode:null,messageHead:null,messageBody:null,editNode:null,copyNode:null,jumpNode:null,about:null,themesBlock:null,themeLink:null},f={connectHostname:null,connectPort:null,connectPassword:null,connectButton:null,loginUsername:null,loginPassword:null,loginNamespace:null,loginDatabase:null,loginButton:null,addNodeName:null,addNodeValue:null,editNodeName:null,editNodeValue:null,copySourcePath:null,copyDestinationPathPart:null,copyDestinationPathNode:null,jumpNodeName:null,aboutField:null},g=function(){var a=b.childNodes;for(var c in a)a.hasOwnProperty(c)&&"DIV"===a[c].tagName&&(a[c].style.opacity=0,a[c].style.visibility="hidden")},h=function(a){setTimeout(function(){a.focus(),a.select()},50)},i=function(a){g(),a.style.opacity=1,a.style.visibility="visible"},j=function(a){e.infoBar.innerHTML=a?'<img class="loadingImage" src="img/loading-black.gif"/>':""};this.hint=function(a){var b,c=document.createElement("DIV"),e={x:0,y:-1},f=55,g=25,h=20,i=9,j=5,k=f;c.className=d,c.innerHTML=a,c.style.opacity=0,b=setInterval(function(){c.style[e.x>0?"left":"right"]=(parseFloat(c.style[e.x>0?"left":"right"])||0)+Math.sin(Math.PI/2*Math.max(f-g,0)/(k-g))*j*e.x+"px",c.style[e.y>0?"top":"bottom"]=(parseFloat(c.style[e.y>0?"top":"bottom"])||0)-Math.sin(Math.PI/2*Math.max(f-g,0)/(k-g))*j*e.y+"px",f--,c.style.opacity=Math.min((k-f)/i,f/(g-h),1),0>f&&(c.parentNode.removeChild(c),clearInterval(b))},25),document.body.appendChild(c)},this.showLoadingAnimation=j,this.showUI=function(){c=!0,app.switchControl(!1),b.style.left=0},this.hideUI=function(){c=!1,app.switchControl(!0),document.activeElement&&document.activeElement.blur(),b.style.left="100%"},this.switchConnectForm=function(){a.showUI(),i(e.connect),h(f.connectHostname)},this.switchLoginForm=function(){a.showUI(),i(e.login),h(f.loginUsername)},this.switchAddNodeForm=function(){a.showUI(),i(e.addNode),h(f.addNodeName),f.addNodeValue.value=""},this.switchEditNodeForm=function(b,c){f.editNodeName.value=b,f.editNodeValue.value=c,a.showUI(),i(e.editNode),h(f.editNodeValue)},this.switchCopyNodeForm=function(b,c){f.copySourcePath.innerHTML=b,f.copyDestinationPathPart.innerHTML=c,a.showUI(),i(e.copyNode),h(f.copyDestinationPathNode)},this.switchJumpNodeForm=function(){a.showUI(),i(e.jumpNode)},this.switchInfoPanel=function(){a.showUI(),i(e.about),f.aboutField.innerHTML="",app.getDescription(function(a){f.aboutField.innerHTML+="<p>"+a+"</p>"})};var k={connect:{setWaitingState:function(a){j(a),f.connectButton.disabled=!!a}},login:{setWaitingState:function(a){j(a),f.loginButton.disabled=!!a}}};this.showMessage=function(a,b){e.messageHead.innerHTML=a,e.messageBody.innerHTML=b,e.message.style.left=0},this.handle={connect:function(){if(c){var b={host:f.connectHostname.value,port:f.connectPort.value,masterPassword:f.connectPassword.value};k.connect.setWaitingState(!0),a.hideUI(),server.connect(b.host,b.port,function(c){c?server.send(b,function(b){var c=b.databases||{},d="";for(var e in c)c.hasOwnProperty(e)&&(d+="<option>"+c[e]+"</option>");f.loginDatabase.innerHTML=d,k.connect.setWaitingState(!1),a.switchLoginForm()}):(k.connect.setWaitingState(!1),a.showMessage("Connection error","Unable to connect to "+b.host+":"+b.port),a.switchConnectForm())})}},login:function(){if(c){var b={username:f.loginUsername.value,password:f.loginPassword.value,namespace:f.loginNamespace.value,database:f.loginDatabase.options[f.loginDatabase.selectedIndex].innerHTML};k.connect.setWaitingState(!0),a.hideUI(),server.send(b,function(c){k.connect.setWaitingState(!1),c&&0===c.error?(a.hideUI(),app.resetTreeRoot(null,b.namespace,b.username)):(a.showMessage("Login error","Unable to login. Server reason: "+(c.reason||"[none]")),a.switchLoginForm())})}},messageClose:function(){e.message.style.left="-100%"},addNode:function(){var b=f.addNodeName.value,c=f.addNodeValue.value;return a.hideUI(),b?void app.handle.addNode(b,c):void a.showMessage("Unable to create node",'"name" field is empty.')},copyNode:function(){a.hideUI(),app.handle.copyNode(f.copyDestinationPathNode.value)},editNode:function(){var b=f.editNodeName.value,c=f.editNodeValue.value;return a.hideUI(),b?void app.handle.editNode(b,c):void a.showMessage("Unable to edit node",'"name" field is empty.')},jumpNode:function(){var b=f.jumpNodeName.value;a.hideUI(),app.handle.jumpNode(b)}};var l=function(){f.connectHostname.value=document.location.hostname,f.connectPort.value=57775,f.connectPassword.value="protect"},m=function(a){a&&a.target&&(document.activeElement=a.target==document?null:a.target)};this.updateSettings=function(){var a=localStorage.getItem("settings-theme")||THEMES[0]||"classic",b=e.themesBlock.innerHTML.indexOf(">")>0;if(!b)for(var c in THEMES)e.themesBlock.innerHTML+='<label onclick="uiController.updateSettings();"><input type="radio" name="settings-theme" value="'+THEMES[c]+'"/'+(a===THEMES[c]?" checked":"")+"> "+THEMES[c]+"</label>&nbsp; ";var d,f=document.getElementsByName("settings-theme");for(d in f)f[d].checked&&(a=f[d].value);e.themeLink.setAttribute("href","css/theme-"+a+".css"),document.body.appendChild(d=document.createElement("DIV")),d.parentNode.removeChild(d),localStorage.setItem("settings-theme",a)},this.init=function(){b=document.getElementById("ui"),e.connect=document.getElementById("ui-connect"),e.login=document.getElementById("ui-login"),e.infoBar=document.getElementById("ui-infoBar"),e.message=document.getElementById("ui-message"),e.messageHead=document.getElementById("ui-message-head"),e.messageBody=document.getElementById("ui-message-body"),e.addNode=document.getElementById("ui-addNode"),e.copyNode=document.getElementById("ui-copyNode"),e.editNode=document.getElementById("ui-editNode"),e.jumpNode=document.getElementById("ui-jumpNode"),e.about=document.getElementById("ui-about"),e.themesBlock=document.getElementById("themesBlock"),e.themeLink=document.getElementById("themeLink");for(var c in f)f.hasOwnProperty(c)&&void 0===(f[c]=document.getElementById(c))&&console.error("Listed element with ID="+c+" is not present in DOM.");document.addEventListener&&document.addEventListener("focus",m,!0),a.updateSettings(),l()}};