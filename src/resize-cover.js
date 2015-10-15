var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

if (h < 650) {
  h = 650;   
}
var hString = h.toString();
var newHeight = hString + "px";
document.getElementById("cover-image").style.height = newHeight;
console.log(h);

var addEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

addEvent(window, "resize", resize_cover);

function resize_cover(){
    
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    if (h < 650) {
        h = 650;   
    }
    
    var hString = h.toString();
    var newHeight = hString + "px";
    document.getElementById("cover-image").style.height = newHeight;
    console.log(h);
}