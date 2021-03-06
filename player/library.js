/**
 * Инициализирует плеер Stories по заданным параметрам
 * @param { {
 *      target: string,
 *      slides: Array<{url: string, alt?: string}>,
 *      delayPerSlide?: number,
 * } }params - параметры инициализации:
 *
 * 1. target - место инициализации плеера, CSS селектор;
 * 2. slides - список слайдов плеера;
 * 3. delayPerSlide - как долго показывается один слайд;
 *
 * @returns {Element|null}
 */

function initPlayer(params) {
    const target = document.querySelector(params.target);
    if (target === null || !params.slides) {
        return null;
    }
    let timelineTimer;
    let timelineChunks = '';
    let playerChunks = '';
    let isFirst = true;
    for (const slide of params.slides) {
        timelineChunks += generateTimelineChunk(isFirst);
        playerChunks += generatePlayerChunk(slide, isFirst);
        isFirst = false;
    }

    target.innerHTML = generatePlayerLayout();

    target.querySelector('.player-chunk-prev').addEventListener('click', switchToPrevChunk);
    target.querySelector('.player-chunk-next').addEventListener('click', switchToNextChunk);

    runChunkSwitching(params.delayPerSlide || 1, 1);

    return target.querySelector('.player');

    // Вспомогательный код =============================================================================================

    function generateTimelineChunk(isFirst) {
        return `
            <div class="timeline-chunk ${isFirst ? 'timeline-chunk-active' : ''}">
                <div class="timeline-chunk-inner"></div>
            </div>`;
    }

    function generatePlayerChunk(slide, isFirst) {
        return `
            <div class="player-chunk ${isFirst ? 'player-chunk-active' : ''}">
                <img src="${slide.url}" alt="${slide.alt || ''}">
                ${generateOverlays(slide)}
            </div>`;
    }

    function generateOverlays(slide) {
        if (slide.overlays === undefined) {
            return '';
        }
        let res = '';
        for (const el of slide.overlays) {
            const styles = (el.styles !== undefined ? Object.entries(el.styles) : [])
                .map(el => el.join(':')).join(';');
            res += `<div class="player-chunk-overlay" style="${styles}">${renderOverlay(el)}</div>`;
        }
        return res;

        function renderOverlay(overlay) {
            if (overlay.type === 'text') {
                return overlay.value;
            } else if (overlay.type === 'img') {
                return `<img src="${overlay.value}" alt="">`;
            }
            return '';
        }
    }

    function generatePlayerLayout() {
        return `
        <div class="player">
            <div class="timeline">${timelineChunks}</div>
            <div class="player-content-wrapper">
                <div class="player-chunk-switcher player-chunk-prev"></div>
                <div class="player-chunk-switcher player-chunk-next"></div>
                <div class="player-content">${playerChunks}</div>
            </div>
        </div>`;
    }

    function moveClass(className, method, pred) {
        const active = target.querySelector(`.${className}`);
        if (pred && !pred(active)) {
            return;
        }
        if (active[method]) {
            active.classList.remove(className);
            active[method].classList.add(className);
            return active;
        }
        return null;
    }

    function switchToPrevChunk() {
        const prev = moveClass('timeline-chunk-active', 'previousElementSibling', el => {
            const inner = el.querySelector('.timeline-chunk-inner');
            const w = parseFloat(inner.style.width) || 0;
            inner.style.width = '';
            return w <= 30;
        });
        if (prev) {
            moveClass('player-chunk-active', 'previousElementSibling');
        }
    }

    function switchToNextChunk() {
        moveClass('player-chunk-active', 'nextElementSibling');
        const el = moveClass('timeline-chunk-active', 'nextElementSibling');
        if (el) {
            el.querySelector('.timeline-chunk-inner').style.width = '';
        }
    }

    function runChunkSwitching(time, step) {
        clearInterval(timelineTimer);
        timelineTimer = setInterval(() => {
            const active = target.querySelector('.timeline-chunk-active').querySelector('.timeline-chunk-inner');
            const w = parseFloat(active.style.width) || 0;
            if (w === 100) {
                switchToNextChunk();
                return;
            }
            active.style.width = w + step + '%';

        }, time * 1000 * step / 100);
    }
}

