const conmutarFondoAnimado = (activado) => {
    if (activado) {
        Anim.on();
    } else {
        Anim.off();
    }
}

const conmutarModoZen = (activado) => {
    const c = 'zen-mode';
    if (activado) {
        document.body.classList.add(c);
    } else {
        document.body.classList.remove(c);
    }
}

const conmutarFichaSound = (activado) => {
    const c = 'ficha-sound';
    if (activado) {
        document.body.classList.add(c);
    } else {
        document.body.classList.remove(c);
    }
}

const conmutarFichaStream = (activado) => {
    const c = 'ficha-stream';
    if (activado) {
        document.body.classList.add(c);
    } else {
        document.body.classList.remove(c);
    }
}


const conmutarReconexionAuto = (activado) => {
    console.log('Reconexión automática:', activado ? 'ON' : 'OFF');
}
