let activeElement = null;
let offset = { x: 0, y: 0 };

// 1. 生成任務貼紙
function createTaskSticker() {
    const text = prompt("請輸入任務內容：");
    if (!text) return;

    const canvas = document.getElementById('sticker-canvas');
    const sticker = document.createElement('div');
    sticker.className = 'active-sticker task-card';
    sticker.innerText = text;
    
    // 初始位置
    sticker.style.left = '50px';
    sticker.style.top = '50px';

    addDragListeners(sticker);
    canvas.appendChild(sticker);
}

// 2. 生成能量貼紙
function createSticker(type) {
    const canvas = document.getElementById('sticker-canvas');
    const sticker = document.createElement('div');
    sticker.className = 'active-sticker';
    
    const icons = { high: '✨', mid: '🌱', low: '☁️', depleted: '🪨' };
    sticker.innerText = icons[type];
    sticker.style.fontSize = '30px';
    sticker.style.left = '100px';
    sticker.style.top = '100px';

    addDragListeners(sticker);
    canvas.appendChild(sticker);
}

// 3. 核心：拖拽邏輯 (這部分你之前漏掉了)
function addDragListeners(el) {
    el.addEventListener('mousedown', startDragging);
    el.addEventListener('touchstart', startDragging, { passive: false });
}

function startDragging(e) {
    activeElement = e.target;
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    const rect = activeElement.getBoundingClientRect();
    offset.x = clientX - rect.left;
    offset.y = clientY - rect.top;

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
}

function drag(e) {
    if (!activeElement) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const canvas = document.getElementById('sticker-canvas').getBoundingClientRect();
    activeElement.style.left = (clientX - canvas.left - offset.x) + 'px';
    activeElement.style.top = (clientY - canvas.top - offset.y) + 'px';
}

function stopDragging() {
    activeElement = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
}