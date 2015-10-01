


var Dots = function (id) {
    var c = document.getElementById(id);
    c.width = c.offsetWidth;
    c.height = c.offsetHeight;
    var ctx = c.getContext("2d");

    var dotsX = [];
    var dotsY = [];
    var dotsXOG = [];
    var dotsYOG = [];
    
    var color = "white";
    
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
    
    
    var getCursorCoords = function(event){
        var x = event.clientX;
        var y = event.clientY;

        var boundary = c.getBoundingClientRect();
        y = y - boundary.top;
        x = x - boundary.left;
        var coords = [x, y];
        
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
            ctx.fillStyle = color;
            ctx.fillRect(dotsX[j], dotsY[j], 5, 5);   
        }
    }
    
    //returns the final y or x value of the drawn line
    this.drawLine = function(startx, starty, endx, endy) {
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
    
    var drawLine = function(startx, starty, endx, endy) {
        var ret = [2];
        if (starty != endy && startx != endx) {
            console.log("not a straight line");
            var countx = 0;
            var county = 0;
            var diffx = Math.abs(startx - endx);
            var diffy = Math.abs(starty - endy);
            var toDraw = (diffx + diffy) / 2;
            console.log("to draw count: " + toDraw);
            for (var j = 0; j < toDraw; j++) {
                console.log(j);
                dotsX.push(startx + countx);
                dotsXOG.push(startx + countx);
                dotsY.push(starty + county);
                dotsYOG.push(starty + county);
                if (starty > endy) {
                    county -= diffy / toDraw;   
                }
                else {
                    county += diffy / toDraw;   
                }
                
                if (startx > endx) {
                    countx -= diffx / toDraw;   
                }
                else {
                    countx += diffx / toDraw;   
                }
            }
        
            ret = [endx, endy];
            console.log("ret is " + ret);
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
            ret = county + starty;
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
            ret = countx + startx;
        }
        return ret;
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
    
    var drawLetterA = function(x,y,w,h) {
        
        var startTop = y;
        
        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + w, y);
        
        y = drawLine(x, y, x, y + h);
        y = y - 0.5 * h;
        x = drawLine(x, y, x - w, y);
        x += w;
        y += 0.5 * h;
        
        return [x, y];
    }

    var drawLetterB = function(x,y,w,h) {

        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + 0.8 * w, y);
        
        y = drawLine(x, y, x, y + h/2);
        x = drawLine(x, y, x - 0.8 * w, y);
        x += 0.8 * w;
        x = drawLine(x, y, x + 0.2 * w, y);
        y = drawLine(x, y, x, y + h/2);
        x = drawLine(x, y, x - w, y);
        
        x += w;
        
        return [x, y];
    }
    
    var drawLetterC = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + w, y);
        x -= w;
        y += h;
        x = drawLine(x, y, x + w, y);
        
        return [x, y];
    }
    
    var drawLetterD = function(x, y, w, h) {
        
        var coords = [2];
        
        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + w * 0.8, y);
        coords = drawLine(x, y, x + 0.2 * w, y + h * 0.2);
        
        x = coords[0];
        y = coords[1];
        
        y = drawLine(x, y, x, y + h * 0.6);
        coords = drawLine(x, y, x - (w * 0.2), y + (h * 0.2));
        
        x = coords[0];
        y = coords[1];
        
        x = drawLine(x, y, x - w * 0.8, y);
        x += w;
        
        console.log("coords returned from draw func: " + coords);
        
        return [x, y];
    }
    
    var drawLetterE = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + w, y);
        x -= w;
        y += h/2;
        x = drawLine(x, y, x + w, y);
        x -= w;
        y += h/2;
        x = drawLine(x, y, x + w, y);
        
        return [x, y];
        
    }
    
    var drawLetterF = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + w, y);
        x -= w;
        y += h/2;
        x = drawLine(x, y, x + w, y);
        y += h/2;
        return [x, y];
    }
    
    var drawLetterG = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + w, y);
        y += h;
        x -= w;
        x = drawLine(x, y, x + w, y);
        y = drawLine(x, y, x, y - h/2);
        x = drawLine(x, y, x - w/2, y);
        
        x += w/2;
        y += h/2;


        return [x, y];
    }
    
    var drawLetterH = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h);
        y += h/2;
        x = drawLine(x, y, x + w, y);
        y -= h/2;
        y = drawLine(x, y, x, y + h);
     
        return [x, y];
    }
    
    var drawLetterI = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h);
        y += h;
        
        return [x, y];
    }
    
    var drawLetterJ = function(x, y, w, h) {
        y = drawLine(x, y, x, y - 0.25*h);
        y += 0.25 * h;
        x = drawLine(x, y, x + 0.75 * w, y);
        y = drawLine(x, y, x, y - h);
        x -= 0.75 * w;
        x = drawLine(x, y, x + w, y);
        y += h;

        return [x, y];
    }
    
    var drawLetterK = function(x,y,w, h) {
        
        y = drawLine(x, y, x, y - h);
        
        x += w;
        y = drawLine(x, y, x, y + .5 * h);
        x = drawLine(x, y, x - w, y);
        x += .75 * w;
        y = drawLine(x, y, x, y + .5 * h);
        x += .25 * w;
        
        return [x, y];
    }
    
    var drawLetterL = function(x, y, w, h) {

        y = drawLine(x, y, x, y - h);
        y += h;
        x = drawLine(x, y, x + w, y);


        return [x, y];
    }
    
    
    var drawLetterM = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h);

        x = drawLine(x, y, x + w/2, y);
        y = drawLine(x, y, x, y + h/2);
        y -= h/2;
        x = drawLine(x, y, x + w/2, y);
        y = drawLine(x, y, x, y + h);  
        
        ret = [x, y];
        return ret;
    }
    
    var drawLetterN = function(x,y,w,h) {
        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + w, y);
        y = drawLine(x, y, x, y + h);
        
        return [x,y];
    }
    
    var drawLetterO = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + w, y);
        y = drawLine(x, y, x, y + h);
        x = drawLine(x, y, x - w, y); 
        x += w;
        
        return [x, y];
    }
    
    var drawLetterP = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + w, y);
        y = drawLine(x, y, x, y + h/2);
        x = drawLine(x, y, x - w, y);
        x += w;
        y += h/2;

        return [x, y];
    }
    
    var drawLetterQ = function(x, y, w, h) {
        ret = [x + w, y];
        
        y = drawLine(x, y, x, y - h);
        x = drawLine(x, y, x + w, y);
        y = drawLine(x, y, x, y + h);
        x = drawLine(x, y, x - w, y);
        x += 4/5 * w;
        
        var coords = drawLine(x, y, x - w/8, y - h/8);
        x = coords[0];
        y = coords[1];
        
        x += w/8;
        y += h/8;
        
        coords = drawLine(x, y, x + w/8, y + h/8);
        x = coords[0];
        y = coords[1];
        
        return ret;
    }
    
    var drawLetterR = function(x, y, w, h) {
    
        y = drawLine(x, y, x, y - h);
        
        x = drawLine(x, y, x + w, y);
        y = drawLine(x, y, x, y + 0.5 * h);
        x = drawLine(x, y, x - w, y);
        x += .75 * w;
        y = drawLine(x, y, x, y + 0.5 * h);
        x += .25 * w;
        
        return [x, y];
    };
    
    var drawLetterS = function(x, y, w, h) {
        x = drawLine(x, y, x + w, y);
        y = drawLine(x, y, x, y - 0.5 * h);
        x = drawLine(x, y, x - w, y);
        y = drawLine(x, y, x, y - 0.5 * h);
        x = drawLine(x, y, x + w, y);
        y += h;
        
        return [x, y];
    }
    
    var drawLetterT = function(x, y, w, h) { 
        x += w/2;
        y = drawLine(x, y, x, y - 50);
        x = drawLine(x, y, x - w/2, y);
        x += w/2;
        x = drawLine(x, y, x + w/2, y);
        y += 50;

        return [x, y];
    }
    
    var drawLetterU = function(x, y, w, h) {
        
        y = drawLine(x, y, x, y - h);
        y += h;
        x = drawLine(x, y, x + w, y);
        y = drawLine(x, y, x, y - h);
        y += h;
        
        return [x, y];

    }
    
    var drawLetterV = function(x, y, w, h) {
        x += w/2;
        var coords = drawLine(x,y, x - w/2, y - h);
        x = coords[0];
        y = coords[1];
        x += w/2;
        y += h;
        coords = drawLine(x, y, x + w/2, y - h);
        x = coords[0];
        y = coords[1];
        y += h;
        
        return [x, y];
    }
    
    var drawLetterW = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h);
        y += h;
        x = drawLine(x, y, x + w/2, y);
        y = drawLine(x, y, x, y - h/2);
        y += h/2;
        x = drawLine(x, y, x + w/2, y);
        y = drawLine(x, y, x, y - h);
        y += h;
        
        return [x, y];
    }
    
    var drawLetterX = function(x, y, w, h) {
        y = drawLine(x, y, x, y - h/3);
        x = drawLine(x, y, x + (3 * w/8), y);
        y = drawLine(x, y, x, y - h/3);
        x = drawLine(x, y, x - (3 * w/8), y);
        y = drawLine(x, y, x, y - h/3);
        
        x += (3* w/8);
        y += (h/2);
        
        x = drawLine(x, y, x + (2 * w/8), y);
        x += (3* w/8);
        y += h/2;
        
        y = drawLine(x, y, x, y - h/3);
        x = drawLine(x, y, x - (3 * w/8), y);
        y = drawLine(x, y, x, y - h/3);
        x = drawLine(x, y, x + (3 * w/8), y);
        y = drawLine(x, y, x, y - h/3);
        
        y += h;

        return [x, y];
    }
    
    var drawLetterY = function(x, y, w, h) {
        y -= h/2;
        y = drawLine(x, y, x, y - h/2);
        y += h/2;
        x = drawLine(x, y, x + w/2, y);
        y = drawLine(x, y, x, y + h/2);
        y -= h/2;
        x = drawLine(x, y, x + w/2, y);
        y = drawLine(x, y, x, y - h/2);
        y += h;
        
        return [x, y];
    }
    
    var drawLetterZ = function(x, y, w, h) {
        y -= h;
        x = drawLine(x, y, x + w, y);
        
        var coords = drawLine(x, y, x - w, y + h);
        y = coords[1];
        x = coords[0];
        
        x = drawLine(x, y, x + w, y);

        return [x, y];
    }
    
    this.drawLetter = function(char, x, y, w, h) {
        ret = [x, y];
        switch(char) {
            case 'a':
                ret = drawLetterA(x,y,w/2,h/2);
                break;
            case 'b':
                ret = drawLetterB(x,y,w/2,h/2);
                break;
            case 'c':
                ret = drawLetterC(x,y,w/2,h/2);
                break;
            case 'd':
                ret = drawLetterD(x,y,w/2,h/2);
                break;
            case 'e':
                ret = drawLetterE(x,y,w/2,h/2);
                break;
            case 'f':
                ret = drawLetterF(x,y,w/2,h/2);
                break;
            case 'g':
                ret = drawLetterG(x,y,w/2,h/2);
                break;
            case 'h':
                ret = drawLetterH(x,y,w/2,h/2);
                break;
            case 'i':
                ret = drawLetterI(x,y,w/2, h/2);
                break;
            case 'j':
                ret = drawLetterJ(x,y,w/2,h/2);
                break;
            case 'k':
                ret = drawLetterK(x,y,w/2,h/2);
                break;
            case 'l':
                ret = drawLetterL(x,y,w/2,h/2);
                break;
            case 'm':
                ret = drawLetterM(x,y,w/2,h/2);
                break;
            case 'n':
                ret = drawLetterN(x,y,w/2,h/2);
                break;
            case 'o':
                ret = drawLetterO(x,y,w/2,h/2);
                break;
            case 'p':
                ret = drawLetterP(x,y,w/2,h/2);
                break;
            case 'q':
                ret = drawLetterQ(x,y,w/2,h/2);
                break;
            case 'r':
                ret = drawLetterR(x,y,w/2,h/2);
                break;
            case 's':
                ret = drawLetterS(x,y,w/2,h/2);
                break;
            case 't':
                ret = drawLetterT(x,y,w/2,h/2);
                break;
            case 'u':
                ret = drawLetterU(x,y,w/2,h/2);
                break;
            case 'v':
                ret = drawLetterV(x,y,w/2,h/2);
                break;
            case 'w':
                ret = drawLetterW(x,y,w/2,h/2);
                break;
            case 'x':
                ret = drawLetterX(x,y,w/2,h/2);
                break;
            case 'y':
                ret = drawLetterY(x,y,w/2,h/2);
                break;
            case 'z':
                ret = drawLetterZ(x,y,w/2,h/2);
                break;
            case 'A':
                ret = drawLetterA(x,y,w,h);
                break;
            case 'B':
                ret = drawLetterB(x,y,w,h);
                break;
            case 'C':
                ret = drawLetterC(x,y,w,h);
                break;
            case 'D':
                ret = drawLetterD(x,y,w,h);
                break;
            case 'E':
                ret = drawLetterE(x,y,w,h);
                break;
            case 'F':
                ret = drawLetterF(x,y,w,h);
                break;
            case 'G':
                ret = drawLetterG(x,y,w,h);
                break;
            case 'H':
                ret = drawLetterH(x,y,w,h);
                break;
            case 'I':
                ret = drawLetterI(x,y,w,h);
                break;
            case 'J':
                ret = drawLetterJ(x,y,w,h);
                break;
            case 'K':
                ret = drawLetterK(x,y,w,h);
                break;
            case 'L':
                ret = drawLetterL(x,y,w,h);
                break;
            case 'M':
                ret = drawLetterM(x,y,w,h);
                break;
            case 'N':
                ret = drawLetterN(x,y,w,h);
                break;
            case 'O':
                ret = drawLetterO(x,y,w,h);
                break;
            case 'P':
                ret = drawLetterP(x,y,w,h);
                break;
            case 'Q':
                ret = drawLetterQ(x,y,w,h);
                break;
            case 'R':
                ret = drawLetterR(x,y,w,h);
                break;
            case 'S':
                ret = drawLetterS(x,y,w,h);
                break;
            case 'T':
                ret = drawLetterT(x,y,w,h);
                break;
            case 'U':
                ret = drawLetterU(x,y,w,h);
                break;
            case 'V':
                ret = drawLetterV(x,y,w,h);
                break;
            case 'W':
                ret = drawLetterW(x,y,w,h);
                break;
            case 'X':
                ret = drawLetterX(x,y,w,h);
                break;
            case 'Y':
                ret = drawLetterY(x,y,w,h);
                break;
            case 'Z':
                ret = drawLetterZ(x,y,w,h);
                break;
            default: 
                console.log(char + " is not a letter");
            
        }
        return ret;
    }
    
    this.writeWord = function (word, x, y, width, height, spacing, fontColor) {
        color = fontColor;
        var len = word.length;
        var ret = [x,y];
        for (var i = 0; i < len; i++) {
            ret = this.drawLetter(word[i], ret[0], ret[1], width, height);  
            ret[0] += spacing;
        }
    }
    
    
    setup();
    
    
};