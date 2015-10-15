$( document ).ready( function () {
    var isChromium = window.chrome,
    vendorName = window.navigator.vendor,
    isOpera = window.navigator.userAgent.indexOf("OPR") > -1;
    if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false) {
        $( "a[href*='#']" ).on( "click", function( event ) {
            event.preventDefault();
            var href = event.target.href; 
            href = href.slice( href.indexOf( "#" ), href.length );
            $( "body" ).animate( {
                scrollTop: $( href ).get( 0 ).offsetTop
            }, 1000 );
    } ); 
    } else { 
   // not Google chrome 
    }
} );