const iconHamburger = document.querySelector('.hamburger');
if (iconHamburger) {
    const menuHeader = document.querySelector('.header__navigation');
    const bg = document.querySelector('.menu__bg');
    const toogleActiveClass = () => {
        menuHeader.classList.toggle('_active');
        iconHamburger.classList.toggle('_active');
        // logo.classList.toggle('_active');
        bg.classList.toggle('_active');
        document.body.classList.toggle('_lock');
    };
    
    iconHamburger.addEventListener('click', () => {
        toogleActiveClass();
    });
    bg.addEventListener('click', (e) => {
        if ((e.target.closest('.header__navigation') == null)||(e.target.closest('.navigation'))) toogleActiveClass();
    });
}