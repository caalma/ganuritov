const AnimList = {
    oscila_01: () => {
        setResolution(10,10)
        osc(10, 0.04, Math.random()*5)
            .rotate(3)
            .brightness(-0.6)
            .out();
    },
    ruido_01: () => {
        setResolution(10,10)
        noise(1)
            .colorama(Math.random()*5)
            .brightness(-0.8)
            .out()
    },
    pasaje_01: () => {
        setResolution(20,30)
        gradient().rotate(0, 0.1)
            .colorama(Math.random()*5)
            .brightness(-0.8)
            .out()
    }
};

const Anim = {
    on: () => {
        if(window.hydraCanvas === undefined){
            window.hydraCanvas = document.createElement('canvas');
            window.hydraCanvas.id = 'hydraCanvas';
            window.background.append(window.hydraCanvas);

            window.hydra = new Hydra({
                canvas: window.hydraCanvas,
                detectAudio: false,
                width: window.innerWidth,
                height: window.innerHeight
            });

            const ALKeys = Object.keys(AnimList);
            const ALk = ALKeys[Math.floor(Math.random() * ALKeys.length)];
            AnimList[ALk]();
        }
    },

    off: () => {
        if(window.hydraCanvas !== undefined){
            hush();
            window.hydraCanvas.remove();
            delete window.hydraCanvas;
            delete window.hydra;
        }
    },


};
