function testScroll(event) {
    if(window.pageYOffset>200) {
        document.getElementById('topDivButton').style.visibility = 'visible';
    }
    else { document.getElementById('topDivButton').style.visibility = 'hidden';
    }
}

window.onscroll = testScroll;
window.onload = testScroll;