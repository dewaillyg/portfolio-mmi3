const tl = gsap.timeline();

function revealSite() {

    tl.to(".pre-loader", 1, {
        opacity: 0,
        display: "none",
        ease: "power2.inOut",
    });

    tl.to(".header-row", 0.8, {
        top: "0",
        ease: "power4.inOut",
        stagger: {
            amount: 0.2,
        },
    }, "-=1.2");

    tl.to(".navbar > *, .footer", 2, {
        y: 40,
        opacity: 1,
        ease: "power4.inOut",
        stagger: {
            amount: 0.2,
        },
    }, "-=1");
}

tl.to(".header > h1", 2, {
    top: 0,
    ease: "power3.inOut",
    stagger: {
        amount: 0.3,
    }
}).to(".pre-loader-btn", 0.3, {
    opacity: 1,
    delay: 0.5,
});