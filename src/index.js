var canvas1 = new Dots("FirstName");

var startLeft = 20, startTop = 0, countx = startLeft, county = startTop;

    //letter M
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 100);
    county = startTop;
    
    countx = canvas1.dots_drawStraightLine(countx, county, countx + 40, county);
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 40);
    county = startTop;
    countx = canvas1.dots_drawStraightLine(countx, county, countx + 40, county);
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 100);

//letter a
    countx += 20;
    county = startTop + 50;
    
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 25);
    countx = canvas1.dots_drawStraightLine(countx, county, countx + 40, county);
    countx -= 40;
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 25);
    county = startTop + 50;
    countx = canvas1.dots_drawStraightLine(countx, county, countx + 40, county);
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 50);
    
    //letter r
    countx += 20;
    county = startTop + 50;
    
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 50);
    county = startTop + 50;
    countx = canvas1.dots_drawStraightLine(countx, county, countx + 40, county);
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 25);
    countx = canvas1.dots_drawStraightLine(countx, county, countx - 39, county);
    countx += 30;
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 25);
    
    //letter k
    countx += 30;
    county = startTop + 50;
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 25);
    countx = canvas1.dots_drawStraightLine(countx, county, countx + 40, county);
    county = canvas1.dots_drawStraightLine(countx, county, countx, county - 25);
    county += 25;
    countx -= 40;
    
    county = canvas1.dots_drawStraightLine(countx, county, countx, county);
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 25);
    county -= 25;
    countx += 30;
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 25);

    countx += 30;
    
    //letter u
    county = canvas1.dots_drawStraightLine(countx, county, countx, county - 50);
    county += 50;
    countx = canvas1.dots_drawStraightLine(countx, county, countx + 40, county);
    county = canvas1.dots_drawStraightLine(countx, county, countx, county - 50);
    countx += 20;
    
    //letter s
    
    countx = canvas1.dots_drawStraightLine(countx, county, countx + 40, county);
    countx -= 40;
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 25);
    countx = canvas1.dots_drawStraightLine(countx, county, countx + 40, county);
    county = canvas1.dots_drawStraightLine(countx, county, countx, county + 25);
    countx = canvas1.dots_drawStraightLine(countx, county, countx - 40, county);
    
    console.log("end of first name x value:");
    console.log(countx + 40);

var canvas2 = new Dots("LastName");

startLeft = 20; 
startTop = 0;
countx = startLeft;
county = startTop;

//N
    
    county += 100;
    county = canvas2.dots_drawStraightLine(countx, county, countx, county - 100);
    countx = canvas2.dots_drawStraightLine(countx, county, countx + 80, county);
    county = canvas2.dots_drawStraightLine(countx, county, countx, county + 100);

    //o
    countx += 20;
    
    county = canvas2.dots_drawStraightLine(countx, county, countx, county - 50);
    countx = canvas2.dots_drawStraightLine(countx, county, countx + 40, county);
    county = canvas2.dots_drawStraightLine(countx, county, countx, county + 50);
    countx = canvas2.dots_drawStraightLine(countx, county, countx - 40, county);
    
    //t
    countx += 60;
    county -= 50;
    
    countx = canvas2.dots_drawStraightLine(countx, county, countx + 40, county);
    countx -= 20;
    county = canvas2.dots_drawStraightLine(countx, county, countx, county + 50);
    
    countx += 20;
    
    //t
    countx += 20;
    county -= 50;
    
    countx = canvas2.dots_drawStraightLine(countx, county, countx + 40, county);
    countx -= 20;
    county = canvas2.dots_drawStraightLine(countx, county, countx, county + 50);
    countx += 20;
    
    //i 
    countx += 20;
    
    county = canvas2.dots_drawStraightLine(countx, county, countx, county - 50);

    console.log("end of last name x value:");
    console.log(countx);
    