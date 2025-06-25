let timer;
let isRunning = false;
let currentMinutes = 25;
let currentSeconds = 0;
let workMinutes = 25;
let breakMinutes = 5;
let isWorkMode = true;
let currentSet = 1;
let maxSets = 4;
let catAnimations = [
    { transform: 'scale(1.1)', duration: 2000 },
    { transform: 'rotate(5deg)', duration: 1500 },
    { transform: 'rotate(-5deg)', duration: 1500 },
    { transform: 'scale(0.9)', duration: 2000 }
];
let currentAnimationIndex = 0;

// テーマ切り替え
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        document.querySelector('.theme-toggle').textContent = '🌙';
    } else {
        body.classList.add('dark-theme');
        document.querySelector('.theme-toggle').textContent = '☀️';
    }
}

// セット数の表示を更新
function updateSetDisplay() {
    const setDisplay = document.getElementById('setDisplay');
    setDisplay.textContent = `セット ${currentSet}/${maxSets}`;
    
    // 最終セットの場合は特別なスタイル
    if (currentSet === maxSets) {
        setDisplay.style.color = 'var(--primary-color)';
        setDisplay.style.fontWeight = 'bold';
    }
}

function updateDisplay() {
    const minutesElement = document.getElementById('minutes');
    const colonElement = document.getElementById('colon');
    const secondsElement = document.getElementById('seconds');
    minutesElement.textContent = currentMinutes.toString().padStart(2, '0');
    colonElement.textContent = ':';
    secondsElement.textContent = currentSeconds.toString().padStart(2, '0');
}

function updateStatus() {
    const status = document.getElementById('status');
    status.textContent = isWorkMode ? '作業モード' : '休憩モード';
    status.style.color = isWorkMode ? 'var(--primary-color)' : 'var(--secondary-color)';
}

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    timer = setInterval(() => {
        if (currentMinutes === 0 && currentSeconds === 0) {
            // モード切り替え
            isWorkMode = !isWorkMode;
            if (isWorkMode) {
                currentMinutes = workMinutes;
                // 作業モードに戻ったときにセット数を更新
                currentSet++;
                if (currentSet > maxSets) {
                    currentSet = 1;
                    // 最終セットの後は特別なアニメーション
                    document.getElementById('cat').style.transform = 'scale(1.5) rotate(360deg)';
                    setTimeout(() => {
                        document.getElementById('cat').style.transform = 'scale(1) rotate(0)';
                    }, 1000);
                }
            } else {
                currentMinutes = breakMinutes;
            }
            currentSeconds = 0;
            updateStatus();
            updateSetDisplay();
            
            // アラーム音を鳴らす
            const audio = new Audio('https://raw.githubusercontent.com/haru1212/pomodoro-timer/main/alarm.mp3');
            audio.play();
            
            // 猫の特別なアニメーション
            document.getElementById('cat').style.transform = 'scale(1.5) rotate(15deg)';
            setTimeout(() => {
                document.getElementById('cat').style.transform = 'scale(1) rotate(0)';
            }, 1000);
            
            return;
        }

        if (currentSeconds === 0) {
            currentMinutes--;
            currentSeconds = 59;
        } else {
            currentSeconds--;
        }
        
        updateDisplay();
        
        // カウントダウン中に猫のアニメーションを変更
        if (currentMinutes === 0 && currentSeconds === 30) {
            currentAnimationIndex = (currentAnimationIndex + 1) % catAnimations.length;
            const animation = catAnimations[currentAnimationIndex];
            document.getElementById('cat').style.transform = animation.transform;
            setTimeout(() => {
                document.getElementById('cat').style.transform = 'scale(1) rotate(0)';
            }, animation.duration);
        }
    }, 1000);
}

function stopTimer() {
    if (!isRunning) return;
    
    isRunning = false;
    clearInterval(timer);
}

function resetTimer() {
    stopTimer();
    currentMinutes = workMinutes;
    currentSeconds = 0;
    isWorkMode = true;
    currentSet = 1;
    updateStatus();
    updateDisplay();
    updateSetDisplay();
    document.getElementById('cat').style.transform = 'scale(1) rotate(0)';
}

// タイマーセットアップのイベントリスナー
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');

workTimeInput.addEventListener('change', (e) => {
    workMinutes = parseInt(e.target.value);
    if (!isRunning) {
        currentMinutes = workMinutes;
        updateDisplay();
    }
});

breakTimeInput.addEventListener('change', (e) => {
    breakMinutes = parseInt(e.target.value);
});

// ボタンのイベントリスナーを設定
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// 初期表示を更新
updateDisplay();
updateStatus();
