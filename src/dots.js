
var Dots = function (id) {
    var c = document.getElementById(id);
    c.width = c.offsetWidth;
    c.height = c.offsetHeight;
    var ctx = c.getContext("2d");

    var dotsX = [];
    var dotsY = [];
    var dotsXOG = [];
    var dotsYOG = [];
    
    var clearCanvas = function () {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    
    var distAndDirFromCursor = function (x, y, event) {
        var coords = getCursorCoords(event);
        var distance = [];
        distance.push(Math.sqrt(((x - coords[0])*(x - coords[0])) + ((y - coords[1])*(y - coords[1]))));
        var rads = Math.atan2((coords[1] - y), (coords[0] - x));
        distance.push(rads);
        return distance;
    }
    
    var distAndDirBetween = function(x, y, x1, y1) {
        var distance = [];
        distance.push(Math.sqrt(((x - x1)*(x - x1)) + ((y - y1)*(y - y1))));
        var rads = Math.atan2((y1 - y), (x1 - x));
        distance.push(rads);
        return distance;
    }
    
    
    var drawAndRemovePoint = function(x, y) {

        clearCanvas();
        var boundary = c.getBoundingClientRect();

        y = y - boundary.top;
        x = x - boundary.left;

        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(x, y, 10, 10);
    }
    
    var getCursorCoords = function(event){
        var x = event.clientX;
        var y = event.clientY;

        var boundary = c.getBoundingClientRect();
        y = y - boundary.top;
        x = x - boundary.left;
        var coords = [x, y];

        var coor = "X coords: " + x + ", Y coords: " + y;
        //document.getElementById("demo").innerHTML = coor;

        return coords;
    }
    
    var gravity = function () {
        var dotsxl = dotsX.length;
        for (var i = 0; i < dotsxl; i++) {
            var radius = distAndDirBetween(dotsX[i], dotsY[i], dotsXOG[i], dotsYOG[i]);
            if(radius[0] > 1) {
                        dotsX[i] += Math.cos(radius[1]);
                        dotsY[i] += Math.sin(radius[1]);
            }
            if(radius[0] > 0.5) {
                        dotsX[i] += 0.5 * Math.cos(radius[1]);
                        dotsY[i] += 0.5 * Math.sin(radius[1]);
            }
            if(radius[0] > 0.2) {
                        dotsX[i] += 0.2 * Math.cos(radius[1]);
                        dotsY[i] += 0.2 * Math.sin(radius[1]);
            }
            if(radius[0] > 0.1) {
                        dotsX[i] += 0.1 * Math.cos(radius[1]);
                        dotsY[i] += 0.1 * Math.sin(radius[1]);
            }
        }

    };

    var refresh = function() {
        clearCanvas();
            for (var j = 0; j < dotsX.length; j++) {
            ctx.fillStyle = "white";
            ctx.fillRect(dotsX[j], dotsY[j], 5, 5);   
        }
    }
    
    //returns the final y or x value of the drawn line
    this.dots_drawStraightLine = function(startx, starty, endx, endy) {
        if (starty != endy && startx != endx) {
            console.log("not a straight line");
            return;
        }
        if (startx == endx) {
            var diff = Math.abs(starty - endy);
            var county = 0;
            for(var i = 0; i < diff; i++) {
                dotsX.push(startx);
                dotsY.push(starty + county);
                dotsXOG.push(startx);
                dotsYOG.push(starty + county);
                if (starty > endy) {
                    county -= 1;
                }
                else {
                    county += 1;
                }
            }
            return county + starty;
        }
        else if (starty == endy) {
            var diff = Math.abs(startx - endx);
            var countx = 0;
            for(var i = 0; i < diff; i++) {
                dotsY.push(starty);
                dotsX.push(startx + countx);
                dotsYOG.push(starty);
                dotsXOG.push(startx + countx);
                if (startx > endx) {
                    countx -= 1;
                }
                else {
                    countx += 1;
                }
            }
            return countx + startx;
        }

    }
    this.moveDots = function(event) {
        var dotsxl = dotsX.length;
        for (var i = 0; i < dotsxl; i++) {
            var distance = distAndDirFromCursor(dotsX[i], dotsY[i], event);
            if (distance[0] < 50 && distance[0] > 5) {

                dotsX[i] -= 2 * Math.cos(distance[1]);
                dotsY[i] -= 2 * Math.sin(distance[1]);

            }

        }
    }
    
    var setup = function() {
        setInterval(gravity, 20);
        setInterval(refresh, 20);
    }
    
    setup();
    
    
};