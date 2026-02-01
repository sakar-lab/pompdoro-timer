document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case ' ':
        case 'Enter':
        case 'p':
            pauseResume() 
            break;
        case 's': 
            startStop();
            break;
        case 'm':
        case 'Escape':
            handleMenu();
            break;
    }
});