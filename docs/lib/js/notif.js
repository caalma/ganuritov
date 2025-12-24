const toast = document.getElementById('notif');
const icon = document.getElementById('icon');
const message = document.getElementById('message');
const close = document.getElementById('close');

const showToast = (status) => {
    toast.classList.remove('connected');
    if (status === 'connected') {
        message.textContent = '¡Stream conectado! Reproduciendo.';
        icon.textContent = '🟢';
        toast.classList.add('connected');
    } else {
        message.textContent = localStorage.getItem('reconexionAutomatica')
            ? 'Stream desconectado. Intentando reconectar...'
            : 'Stream desconectado.';
        icon.textContent = '🔴';
    }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
}

close.onclick = () => toast.classList.remove('show');
