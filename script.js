const slider = document.querySelector('.slider-container'),
slides = Array.from(document.querySelectorAll('.slide'));

let isdragging = false,
    startposition = 0,
    currenttranslate = 0,
    previoustranslate =0,
    animationid = 0,
    currentindex = 0;

slides.forEach((slide,index) => {
    const slideimage = slide.querySelector('img');
    slideimage.addEventListener('dragstart', (e) => e.preventDefault());

    // TOUCH EVENT
    slide.addEventListener('touchstart', touchStart(index));
    slide.addEventListener('touchend', touchEnd);
    slide.addEventListener('touchmove', touchMove);


    // MOUSE EVENT
    slide.addEventListener('mousedown', touchStart(index));
    slide.addEventListener('mouseup', touchEnd);
    slide.addEventListener('mouseleave', touchEnd);
    slide.addEventListener('mousemove', touchMove);

})

//disable context menu
window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}


function touchStart(index) {
    return function(event) {
        currentindex = index;
        startposition = getpositionX(event);
        isdragging = true;
        // https://css-tricks.com/using-requestanimationframe/
        animationid = requestAnimationFrame(animation);
        slider.classList.add('grabbing');
    }
}

function touchEnd () {
    isdragging = false;
    cancelAnimationFrame(animationid);

    const movedby = currenttranslate - previoustranslate;

    if(movedby < -100 && currentindex < slides.length-1) {
        currentindex += 1;
    }
    if(movedby > 100 && currentindex > 0) {
        currentindex -= 1;
    }

    setpositionbyindex();

    slider.classList.remove('grabbing');
}

function touchMove (event) {
    if (isdragging) {
        const currentPosition = getpositionX(event);
        currenttranslate = previoustranslate + currentPosition - startposition;
    }
}

function getpositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
    setSliderPosition();
    if(isdragging) {
        requestAnimationFrame(animation);
    } 
}

function setSliderPosition() {
    slider.style.transform = `translateX(${currenttranslate}px)`;
}

function setpositionbyindex () {
    currenttranslate = currentindex * -window.innerWidth;
    previoustranslate = currenttranslate;
    setSliderPosition();
}