const PUNTO_DE_MONTAJE = '/ganuritov.ogg';

const colors = [
    '#0000ff55',
    '#00ff0055',
    '#ff000055',
    '#aaff0055',
    '#ffaa0055',
    '#00ffaa55',
    '#ff00aa55',
    '#00aaff55',
    '#aa00ff55',
]

var color_id = 0

const addRow = (ul, label, value) => {
    if(value !== ''){
        const li = document.createElement('li');
        li.innerHTML = `<em>${label}</em> <strong>${value}`;
        ul.appendChild(li);
    }
};


/* :P solo util hasta actualizar a liquidsoap > 2 */
const verificar_live = (data) => {
    if (!data?.icestats?.source || !Array.isArray(data.icestats.source)) {
        return data;
    }
    const myMount = data.icestats.source.find(s => s.listenurl?.endsWith(PUNTO_DE_MONTAJE));
    if (!myMount) {
        return data;
    }

    if(myMount.genre == 'live'){
        data.ogg['GENRE'] = myMount.genre;
        data.ogg['COMMENT'] = myMount.server_description;
    }
    return data;
}


const info_server = (data, element) => {
    if (!data?.icestats?.source || !Array.isArray(data.icestats.source)) {
        element.textContent = 'Datos del servidor no disponibles.';
        return;
    }

    const myMount = data.icestats.source.find(s => s.listenurl?.endsWith(PUNTO_DE_MONTAJE));
    if (!myMount) {
        element.textContent = 'Tu emisora no está activa en este momento.';
        return;
    }

    const server = data.icestats;
    const now = new Date();
    const ul = document.createElement('ul');

    addRow(ul, 'Servidor', server.host || '');
    addRow(ul, 'Bitrate', myMount.audio_bitrate ? `${parseInt(myMount.audio_bitrate) / 1000} kbps` : '');
    addRow(ul, 'Canales', myMount.audio_channels ? `${myMount.audio_channels}` : '');
    addRow(ul, 'Samplerate', myMount.audio_samplerate ? `${parseInt(myMount.audio_samplerate) / 1000} kHz` : '');
    //addRow(ul, 'Oyentes actuales', myMount.listeners ?? '');
    //addRow(ul, 'Máximo de oyentes', myMount.listener_peak ?? '');

    element.innerHTML = '';
    element.appendChild(ul);
}




const info_current_sound = (data, element) => {
    if (!data?.ogg || typeof data.ogg !== 'object') {
        element.textContent = 'Sin metadatos de audio disponibles.';
        return;
    }

    const soundO = data.ogg;
    const ul = document.createElement('ul');

    addRow(ul, 'Titulo', soundO.TITLE || '');
    addRow(ul, 'Autoría', soundO.ARTIST || '');
    addRow(ul, 'Fecha', soundO.DATE || '');
    addRow(ul, 'Album', soundO.ALBUM || '');
    addRow(ul, 'Género', soundO.GENRE || '');
    addRow(ul, 'Comentarios', soundO.COMMENT || '');

    element.innerHTML = '';
    element.appendChild(ul);

    element.style.backgroundColor = colors[color_id % colors.length];
    color_id += 1;

    setTimeout(()=>{
        element.style.backgroundColor = '#00000055'
    }, 5000);
}
