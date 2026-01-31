const menuButton = document.getElementById('menu-button');
const menu = document.querySelector('menu');
const overlay = document.getElementById('overlay');

menuButton.addEventListener('click', handleMenuLinkClick);
overlay.addEventListener('click', handleMenuLinkClick);

function handleMenuLinkClick(event) {
    event.preventDefault();
    if (menu.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
        menu.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
        menu.classList.add('hidden');
    }
}
