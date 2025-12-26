// Diccionarios (igual que antes)
const functionsDict = {
    'now': () => {
        let a = window.Date().toLocaleString();
        return {
            title: 'Ahora es : ',
            content:  `${a}`,
        }
    }
};

const objectsDict = {
    'ayuda': {
        title: 'Ayuda',
        content: '...',
    }
};

let pPanelTitle = undefined;
let pPanelContent = undefined;
let pOverlay = undefined;
let pFloatingPanel = undefined;

const clearLocationHash = () => {
    const urlSinHash = location.origin + location.pathname + location.search;
    history.replaceState(null, '', urlSinHash);
}

const showPanel = (data) => {
    if (!data || !data.title || !data.content) return;
    pPanelTitle.textContent = data.title;
    pPanelContent.innerHTML = data.content;
    pOverlay.style.display = 'block';
    pFloatingPanel.style.display = 'block';
}

const closePanel = () => {
    pOverlay.style.display = 'none';
    pFloatingPanel.style.display = 'none';
    clearLocationHash();
}

const handleHashChange = () => {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const key = params.get('oD');
     // Cerrar el panel al quitar el hash
    if (!key) { closePanel(); return; }

    if (functionsDict[key]) {
        showPanel(functionsDict[key]());
        return;
    }

    if (objectsDict[key]) {
        showPanel(objectsDict[key]);
        return;
    }

    fetch(`./info/${key}.json`)
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(data => {
            data['title'] = data.meta.title;
            data['content'] = generarContenido(data);
            console.log(data);
            showPanel(data);
        })
        .catch(() => showNotif(true, `El contenido "${key}" no existe.`));
}

const generarContenido = (datos) => {
    if (!datos || typeof datos !== 'object') {
        return '<ul><li>Datos inválidos</li></ul>';
    }

    const { meta = {}, info = {} } = datos;
    const order_meta = ['artist', 'album', 'date', 'genre', 'comment'];
    const order_info = ['licencia', 'fuente'];
    const etiquetas = {
        title: 'Título',
        album: 'Álbum',
        artist: 'Artista',
        date: 'Año',
        genre: 'Género',
        comment: 'Comentario',
        licencia: 'Licencia',
        fuente: 'Fuente'
    };
    const items = [];

    // Agregar metadatos
    for (const clave of order_meta) {
        if (clave in meta) {
            const valor = meta[clave];
            if (valor && valor.trim() !== '') {
                const etiqueta = etiquetas[clave] || clave.charAt(0).toUpperCase() + clave.slice(1);
                if (clave === 'artist') {
                    items.push(`<li><span class="item-key">${etiqueta}:</span> <strong>${valor.trim()}</strong></li>`);
                } else {
                    items.push(`<li><span class="item-key">${etiqueta}:</span> ${valor.trim()}</li>`);
                }
            }
        }
    }

    // Agregar informaciones
    for (const clave of order_info) {
        if (clave in info) {
            const valor = info[clave];

            if (clave === 'licencia') {
                if (licencias[info.licencia]) {
                    items.push(`<li><span class="item-key">Licencia:</span> ${link_licencia(info.licencia)}</li>`);
                } else  {
                    // En caso de licencia no mapeada, mostrar el código
                    items.push(`<li><span class="item-key">Licencia:</span> ${info.licencia}</li>`);
                }
            } else if (clave === 'fuente') {
                if (valor && valor.trim() !== '') {
                    const etiqueta = etiquetas[clave] || clave.charAt(0).toUpperCase() + clave.slice(1);
                    items.push(`<li><span class="item-key">${etiqueta}:</span> <a href="${valor.trim()}" target="_blank">${valor.trim()}</a></li>`);
                }
            } else {
                if (valor && valor.trim() !== '') {
                    const etiqueta = etiquetas[clave] || clave.charAt(0).toUpperCase() + clave.slice(1);
                    items.push(`<li><span class="item-key">${etiqueta}:</span> ${valor.trim()}</li>`);
                }
            }
        }
    }


    if (items.length === 0) {
        return '<ul><li>Sin metadatos disponibles</li></ul>';
    }

    return `<ul>${items.join('')}</ul>`;
}


const openPanel = (key) => {
    location.hash = `#oD=${key}`;
}

// Escuchas
window.addEventListener('load', ()=>{
    pPanelTitle = document.getElementById('panel-title');
    pPanelContent = document.getElementById('panel-content');
    pOverlay = document.getElementById('overlay');
    pFloatingPanel = document.getElementById('floating-panel');
    handleHashChange();
});
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
});
