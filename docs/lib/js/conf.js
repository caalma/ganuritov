const set_menu_cfg = () => {
    const settings = {
        'fondo-animado':         { key: 'fondoAnimado',         fn: conmutarFondoAnimado },
        'modo-zen':              { key: 'modoZen',              fn: conmutarModoZen },
        'ficha-sound':              { key: 'fichaSound',              fn: conmutarFichaSound },
        'ficha-stream':              { key: 'fichaStream',              fn: conmutarFichaStream }
        //'reconexion-automatica': { key: 'reconexionAutomatica', fn: aplicarReconexionAuto }
    };

    const btn = document.getElementById('settings-btn');
    const panel = document.getElementById('settings-panel');

    // Conmutar panel
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    // Cerrar menú
    document.addEventListener('click', () => {
        panel.classList.remove('open');
    });

    panel.addEventListener('click', (e) => e.stopPropagation());


    Object.keys(settings).forEach(id => {
        const checkbox = document.getElementById(id);
        if (!checkbox) return;

        const { key, fn } = settings[id];

        // Recuperar valor
        const saved = localStorage.getItem(key);
        const value = saved !== null ? saved === 'true' : false;
        checkbox.checked = value;

        // Ejecutar al cargar página
        if (fn) fn(value);

        checkbox.addEventListener('change', () => {
            const newValue = checkbox.checked;
            localStorage.setItem(key, newValue);

            window.dispatchEvent(new CustomEvent('settingChange', {
                detail: { key, value: newValue, id }
            }));

            // Ejecutar al cambiar
            if (fn) fn(newValue);
        });
    });
};

//window.addEventListener('settingChange', (e) => {
//    const { key, value, id } = e.detail;
//    console.log(`Configuración cambiada: ${key} → ${value}`);
//});

document.addEventListener('DOMContentLoaded', set_menu_cfg);
