var hydra = new Hydra({
    canvas: document.getElementById("hydraCanvas"),
    detectAudio: false,
    width: window.innerWidth,
    height: window.innerHeight
});


const Anim = [
    () => {
        osc(10, 0.04, Math.random()*5)
            .rotate(3)
            .brightness(-0.6)
            .out();
    },
    () => {
        noise(1)
            .colorama(Math.random()*5)
            .brightness(-0.8)
            .out()
    }
];

window.addEventListener('load', () => {
    setResolution(10,10);
    Anim[Math.round(Math.random() * Anim.length)]();
});
