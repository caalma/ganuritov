
let playerControl = undefined;
let isConnected = false;
let reconnectInterval = null;
let stallTimeout = null;
let monitoringActive = false;
let userPause = false;

const stallThreshold = 5000;
const reconnectDelay = 5000;

let audio = document.getElementById('radio');
let playButton = document.getElementById('playButton');
let volumeBtn = document.getElementById('volumeBtn');
let volumePopup = document.getElementById('volumePopup');
let volumeSlider = document.getElementById('volumeSlider');
let volumeValue = document.getElementById('volumeValue');
let timeDisplay = document.getElementById('timeDisplay');

let isPlaying = false;
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;


// Auto reconección
const startMonitoring = () => {
    if (monitoringActive) return;
    monitoringActive = true;

    audio.addEventListener('playing', () => {
        if (!isConnected) {
            isConnected = true;
            showToast('connected');
            clearInterval(reconnectInterval);
            clearTimeout(stallTimeout);
        }
    });

    audio.addEventListener('error', handleDisconnect);
    audio.addEventListener('stalled', checkStall);
    audio.addEventListener('timeupdate', resetStallTimer);
    audio.addEventListener('ended', handleDisconnect);
}

const handleDisconnect = () => {
    if (!userPause) {
        if (isConnected) {
            isConnected = false;
            showToast('disconnected');
            if (localStorage.getItem('reconexionAutomatica')) {
                reconnectInterval = setInterval(attemptReconnect, reconnectDelay);
            }
            stopTimer();
            playButton.classList.add('icono-alert');
            playButton.classList.remove('icono-pause');
            playButton.classList.remove('icono-play');
        }
    }
}

const checkStall = () => {
    clearTimeout(stallTimeout);
    stallTimeout = setTimeout(handleDisconnect, stallThreshold);
}

const resetStallTimer = () => {
    clearTimeout(stallTimeout);
    stallTimeout = setTimeout(handleDisconnect, stallThreshold);
}

const attemptReconnect = () => {
    audio.load();
    audio.play().then(()=>{
        startTimer();
    }).catch(() => {
        // para cuando falla
    });
}

// Actualizar tiempo
const updateTime = () => {
    elapsedTime = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    timeDisplay.textContent =
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
}

const stopTimer = () => {
    clearInterval(timerInterval);
}

const startTimer = () => {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTime, 1000);
    playButton.classList.remove('icono-alert');
    playButton.classList.add('icono-pause');
    playButton.classList.remove('icono-play');
}


window.addEventListener('load', () => {
    audio = document.getElementById('radio');
    playButton = document.getElementById('playButton');
    volumeBtn = document.getElementById('volumeBtn');
    volumePopup = document.getElementById('volumePopup');
    volumeSlider = document.getElementById('volumeSlider');
    volumeValue = document.getElementById('volumeValue');
    timeDisplay = document.getElementById('timeDisplay');
    isPlaying = false;
    startTime = 0;
    elapsedTime = 0;
    timerInterval = null;

    // Play/Pause
    playButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            stopTimer();
            playButton.classList.remove('icono-alert');
            playButton.classList.remove('icono-pause');
            playButton.classList.add('icono-play');
            userPause = true;
        } else {
            audio.play().then(() => {
                startButton.classList.add('hidden');
                playerControl.classList.remove('hidden');
                startMonitoring();
                isConnected = true;
                if (!userPause) { showToast('connected'); }
                userPause = false;
            }).catch(err => {
                alert('Error al reproducir: ' + err.message);
            });
            startTimer();
        }
        isPlaying = !isPlaying;
    });

    // Toggle volume popup
    volumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        volumePopup.classList.toggle('active');
    });

    // Close popup when clicking outside
    document.addEventListener('click', () => {
        volumePopup.classList.remove('active');
    });

    // Prevent popup close when clicking inside
    volumePopup.addEventListener('click', (e) => e.stopPropagation());

    // Control de volumen
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        audio.volume = volume;
    });


    playerControl = document.querySelector('.player .controls-row');
    const startButton = document.getElementById('startButton');

    startButton.onclick = () => {  playButton.click(); };

});
