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

const licencias = {
    'ccbyncsa4': ['CC BY-NC-SA 4.0', 'https://creativecommons.org/licenses/by-nc-sa/4.0/'],
    'ccby4': ['CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0'],
    'slppus': ['Sin licencia pública', './licencias/slppus']
}


function extraerMetadatos(cadena) {
    const regex = /(&[A-Za-z_][A-Za-z0-9_]*)=([^&\s]*)/g;
    const metadatos = {};
    let match;
    let cadenaLimpia = cadena;

    while ((match = regex.exec(cadena)) !== null) {
        const clave = match[1].substring(1); // quitar '&'
        const valor = match[2];
        metadatos[clave] = valor;
    }

    cadenaLimpia = cadena.replace(/(&[A-Za-z_][A-Za-z0-9_]*)=[^&\s]*/g, '');
    cadenaLimpia = cadenaLimpia.replace(/\s{2,}/g, ' ').trim();

    //console.log(metadatos);

    return {
        texto: cadenaLimpia,
        extra: metadatos
    };
}

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

    if(myMount.genre === 'live'){
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


const link_licencia = (key) => {
    if(!(key in licencias)) return key;
    return `<a href="${licencias[key][1]}" target="_blank" rel="noopener">${licencias[key][0]}</a>`;
}


var soundM = undefined;

const info_current_sound = (data, element) => {
    if (!data?.ogg || typeof data.ogg !== 'object') {
        element.textContent = 'Sin metadatos de audio disponibles.';
        return;
    }

    const soundO = data.ogg;
    const controlData = JSON.stringify(soundO);

    if (soundM == controlData){ return; }

    soundM = controlData;
    const ul = document.createElement('ul');
    const dataComment = extraerMetadatos(soundO.COMMENT || '')

    addRow(ul, 'Titulo', soundO.TITLE || '');
    addRow(ul, 'Autoría', soundO.ARTIST || '');
    addRow(ul, 'Fecha', soundO.DATE || '');
    addRow(ul, 'Album', soundO.ALBUM || '');
    addRow(ul, 'Género', soundO.GENRE || '');
    addRow(ul, 'Comentarios', dataComment.texto || '');

    if('LI' in dataComment.extra){
        addRow(ul, 'Licencia', link_licencia(dataComment.extra['LI']));
    }

    element.innerHTML = '';
    element.appendChild(ul);

    element.style.backgroundColor = colors[color_id % colors.length];
    color_id += 1;

    setTimeout(()=>{
        element.style.backgroundColor = '#00000055'
    }, 5000);
}


// Agregado al iniciar
window.addEventListener('load', () => {
    const elStats = document.getElementById("server_stats");
    const elSound = document.getElementById("current_sound");
    const statsListener =
          new IcecastMetadataStats(
              URL_STREAM,
              {
                  interval: 30,
                  sources: [
                      "ogg",
                      "icestats",
                  ],
                  onStats: (stats) => {
                      stats = verificar_live(stats);
                      //console.log(stats);
                      info_server(stats, elStats);
                      info_current_sound(stats, elSound)
                  }
              }
          );
    statsListener.start();
});
