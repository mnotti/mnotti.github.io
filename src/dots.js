var c = document.getElementById("dots");
c.width = c.offsetWidth;
c.height = c.offsetHeight;

var ctx = c.getContext("2d");

var dotsX = [];
var dotsY = [];
var dotsXOG = [];
var dotsYOG = [];
var bools = [];

setUp(dotsX, dotsY);

setInterval(gravity, 20);
setInterval(refresh, 20);



function setUp (dotsX, dotsY) {
    var startLeft = 40;
    var startTop = 150;
    var countx = startLeft;
    var county = startTop;

    //letter M
    county = dots_drawStraightLine(countx, county, countx, county + 100);
    county = startTop;
    
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    county = dots_drawStraightLine(countx, county, countx, county + 40);
    county = startTop;
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    county = dots_drawStraightLine(countx, county, countx, county + 100);
    
    //letter a
    countx += 20;
    county = startTop + 50;
    
    county = dots_drawStraightLine(countx, county, countx, county + 25);
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    countx -= 40;
    county = dots_drawStraightLine(countx, county, countx, county + 25);
    county = startTop + 50;
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    county = dots_drawStraightLine(countx, county, countx, county + 50);
    
    //letter r
    countx += 20;
    county = startTop + 50;
    
    county = dots_drawStraightLine(countx, county, countx, county + 50);
    county = startTop + 50;
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    county = dots_drawStraightLine(countx, county, countx, county + 25);
    countx = dots_drawStraightLine(countx, county, countx - 39, county);
    countx += 30;
    county = dots_drawStraightLine(countx, county, countx, county + 25);
    
    //letter k
    countx += 30;
    county = startTop + 50;
    county = dots_drawStraightLine(countx, county, countx, county + 25);
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    county = dots_drawStraightLine(countx, county, countx, county - 25);
    county += 25;
    countx -= 40;
    
    county = dots_drawStraightLine(countx, county, countx, county);
    county = dots_drawStraightLine(countx, county, countx, county + 25);
    county -= 25;
    countx += 30;
    county = dots_drawStraightLine(countx, county, countx, county + 25);

    countx += 30;
    
    //letter u
    county = dots_drawStraightLine(countx, county, countx, county - 50);
    county += 50;
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    county = dots_drawStraightLine(countx, county, countx, county - 50);
    countx += 20;
    
    //letter s
    
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    countx -= 40;
    county = dots_drawStraightLine(countx, county, countx, county + 25);
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    county = dots_drawStraightLine(countx, county, countx, county + 25);
    countx = dots_drawStraightLine(countx, county, countx - 40, county);

    
    //N
    countx += 80;
    
    county = dots_drawStraightLine(countx, county, countx, county - 100);
    countx = dots_drawStraightLine(countx, county, countx + 80, county);
    county = dots_drawStraightLine(countx, county, countx, county + 100);

    //o
    countx += 20;
    
    county = dots_drawStraightLine(countx, county, countx, county - 50);
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    county = dots_drawStraightLine(countx, county, countx, county + 50);
    countx = dots_drawStraightLine(countx, county, countx - 40, county);
    
    //t
    countx += 60;
    county -= 50;
    
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    countx -= 20;
    county = dots_drawStraightLine(countx, county, countx, county + 50);
    
    countx += 20;
    
    //t
    countx += 20;
    county -= 50;
    
    countx = dots_drawStraightLine(countx, county, countx + 40, county);
    countx -= 20;
    county = dots_drawStraightLine(countx, county, countx, county + 50);
    countx += 20;
    
    //i 
    countx += 20;
    
    county = dots_drawStraightLine(countx, county, countx, county - 50);
    
    //print out the results
    for (var j = 0; j < dotsX.length; j++) {
        ctx.fillStyle = "rgba(200,100,50,0.8)";
        ctx.fillRect(dotsX[j], dotsY[j], 5, 5);   
    }
    for (j = 0; j < dotsX.length; j++) {
        bools[j] = false;
    }
    
}

function clearCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function distAndDirFromCursor(x, y, event) {
    var coords = getCursorCoords(event);
    var distance = [];
    distance.push(Math.sqrt(((x - coords[0])*(x - coords[0])) + ((y - coords[1])*(y - coords[1]))));
    var rads = Math.atan2((coords[1] - y), (coords[0] - x));
    distance.push(rads);
    return distance;
}

function distAndDirBetween(x, y, x1, y1) {
    var distance = [];
    distance.push(Math.sqrt(((x - x1)*(x - x1)) + ((y - y1)*(y - y1))));
    var rads = Math.atan2((y1 - y), (x1 - x));
    distance.push(rads);
    return distance;
}

function drawAndRemovePoint(x, y) {
    
    clearCanvas(ctx);
    var boundary = c.getBoundingClientRect();

    y = y - boundary.top;
    x = x - boundary.left;
    
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(x, y, 10, 10);
}

function showCoords(event) {
    moveDots(event);
}	

function getCursorCoords(event){
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

function moveDots(event) {
    var dotsxl = dotsX.length;
    for (var i = 0; i < dotsxl; i++) {
        var distance = distAndDirFromCursor(dotsX[i], dotsY[i], event);
        if (distance[0] < 50 && distance[0] > 5 /* && !bools[i]*/) {

            dotsX[i] -= 2 * Math.cos(distance[1]);
            dotsY[i] -= 2 * Math.sin(distance[1]);

        }

    }
}

function gravity () {
    var dotsxl = dotsX.length;
    for (var i = 0; i < dotsxl; i++) {
        var radius = distAndDirBetween(dotsX[i], dotsY[i], dotsXOG[i], dotsYOG[i]);
        if(radius[0] > 1 /* && !bools[i]*/) {
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

}

function refresh() {
    console.log("refreshing");
    clearCanvas();
        for (var j = 0; j < dotsX.length; j++) {
        ctx.fillStyle = "white";
        ctx.fillRect(dotsX[j], dotsY[j], 5, 5);   
    }
}


//drawing with dots

//returns the final y or x value of the drawn line
function dots_drawStraightLine(startx, starty, endx, endy) {
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
