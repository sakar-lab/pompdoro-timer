document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case ' ':
        case 'p':
            pauseResume() 
            break;
        case 's': 
            startStop();
            break;
        case 'm':
            handleMenuLinkClick();
            break;
    }
});