// Глобальные переменные =================
const prevStorySwitcher = document.querySelector('.player-chunk-prev');
const nextStorySwitcher = document.querySelector('.player-chunk-next');
let timer;

// =======================================

// Функции ===============================
const moveClass = (className, method, pred) => {
    const active = document.querySelector(`.${className}`);
    if (pred && !pred(active)) {
        return;
    }
    if (active[method]) {
        active.classList.remove(className);
        active[method].classList.add(className);
        return active;
    }
    return null;
};

const next = () => {
    moveClass('player-chunk-active', 'nextElementSibling');
    const el = moveClass('timeline-chunk-active', 'nextElementSibling');
    if (el) {
        el.querySelector('.timeline-chunk-inner').style.width = '';
    }
};

const runInterval = (time, step) => {
    clearInterval(timer);
    timer = setInterval(() => {
        const active = document.querySelector('.timeline-chunk-active').querySelector('.timeline-chunk-inner');
        const w = parseFloat(active.style.width) || 0;
        if (w === 100) {
            next();
            return;
        }
        active.style.width = w + step + '%';

    }, time * 1000 * step / 100);
};

// ======================================

prevStorySwitcher.addEventListener('click', () => {
    const prev = moveClass('timeline-chunk-active', 'previousElementSibling', el => {
        const inner = el.querySelector('.timeline-chunk-inner');
        const w = parseFloat(inner.style.width) || 0;
        el.querySelector('.timeline-chunk-inner').style.width = '';
        return w <= 30;
    });
    if (prev) {
        moveClass('player-chunk-active', 'previousElementSibling');
    }
});

nextStorySwitcher.addEventListener('click', next);

runInterval(5, 1);