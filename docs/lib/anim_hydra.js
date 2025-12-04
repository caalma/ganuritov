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
