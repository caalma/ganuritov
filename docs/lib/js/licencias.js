const licencias = {
    'ccbyncsa4': ['CC BY-NC-SA 4.0', 'https://creativecommons.org/licenses/by-nc-sa/4.0/'],
    'slppus': ['Sin licencia pública', './licencias/slppus']
}

const link_licencia = (key) => {
    if(!(key in licencias)) return key;
    return `<a href="${licencias[key][1]}" target="_blank" rel="noopener">${licencias[key][0]}</a>`;
}
