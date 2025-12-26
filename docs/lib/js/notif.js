let n_notif = undefined;
let n_message = undefined;
let n_close = undefined;

const showNotif = (error, msg) => {
    n_notif.classList.remove('good');
    if (!error) {
        n_notif.classList.add('good');
    }
    n_message.textContent = msg
    n_notif.classList.add('show');
    setTimeout(() => n_notif.classList.remove('show'), 5000);
}

const showNotifConnection = (status) => {
    n_notif.classList.remove('good');
    if (status === 'connected') {
        n_message.textContent = '¡Stream conectado! Reproduciendo.';
        n_notif.classList.add('good');
    } else {
        n_message.textContent = localStorage.getItem('reconexionAutomatica')
            ? 'Stream desconectado. Intentando reconectar...'
            : 'Stream desconectado.';
    }
    n_notif.classList.add('show');
    setTimeout(() => n_notif.classList.remove('show'), 5000);
}

window.addEventListener('load', ()=>{
    n_notif = document.querySelector('#notif');
    n_message = document.querySelector('#notif .message');
    document.querySelector('#notif .close').onclick = () => notif.classList.remove('show');
});
