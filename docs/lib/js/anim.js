const gcd = (a, b) => {
    return b === 0 ? a : gcd(b, a % b);
};

const calcularCuadriculaCuadrada = (width, height) => {
    const w = Math.floor(width);
    const h = Math.floor(height);
    if (w <= 0 || h <= 0) {
        return { cols: 0, rows: 0, divisor: 0 };
    }
    const divisor = gcd(w, h);
    const cols = w / divisor;
    const rows = h / divisor;
    return { cols, rows, divisor };
};

const dowmScale = (a, b, m=10) => {
    if (Math.max(a,b) < m) {
        return [a, b];
    }else{
        const aa = a / 2;
        const bb = b / 2;
        return dowmScale(aa, bb, m);
    }
};

const defineColsRowsGrid = () => {
    const A = calcularCuadriculaCuadrada(window.innerWidth, window.innerHeight);
    const D = dowmScale(A.cols, A.rows, limitGrid);
    Aw = Math.ceil(D[0]);
    Ah = Math.ceil(D[1]);
};

const AnimList = {
    oscila_01: () => {
        setResolution(Aw,Ah)
        osc(10, 0.04, Math.random()*5)
            .rotate(3)
            .brightness(-0.6)
            .out();
    },
    ruido_01: () => {
        setResolution(Aw,Ah)
        noise(1)
            .colorama(Math.random()*5)
            .brightness(-0.8)
            .out()
    },
    pasaje_01: () => {
        setResolution(Aw,Ah)
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
    }

};

var Aw = 1;
var Ah = 1;
const limitGrid = 20;
defineColsRowsGrid();


// iniciar
window.addEventListener('resize', () => {
    defineColsRowsGrid();
    Anim.off();
    Anim.on();
});
