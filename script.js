// 移除舊的容器避免重複
const oldContainer = document.getElementById('bg-glitter-container');
if (oldContainer) oldContainer.remove();

const bgContainer = document.createElement('div');
bgContainer.id = 'bg-glitter-container';
document.body.prepend(bgContainer);

const count = 50; // 假設數量

for (let i = 0; i < count; i++) {
    const box = document.createElement('div');
    box.classList.add('glitter-box');

    // 顏色邏輯：30% 白色，70% 金色(或綠色)
    const isWhite = Math.random() > 0.7;
    if (isWhite) {
        box.style.setProperty('--bg-color', 'rgb(250, 250, 250)'); 
    } else {
        // 如果想要金色，建議用: 'rgb(255, 215, 0)'
        // 這是你原本碼中的綠色：
        box.style.setProperty('--bg-color', 'rgba(59, 189, 45, 0.78)'); 
    }

    const size = Math.random() * 15 + 5; // 方塊大小 5px - 20px
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    const duration = (Math.random() * 3 + 2).toFixed(2);
    const delay = (Math.random() * -5).toFixed(2);

    // 使用 Object.assign 統一注入樣式
    Object.assign(box.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${posX}%`,
        top: `${posY}%`,
        animation: `blink ${duration}s infinite ease-in-out ${delay}s`
    });

    bgContainer.appendChild(box);
}

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
function createTaskByType(typeText, color) {
    const canvas = document.getElementById('sticker-canvas');
    const sticker = document.createElement('div');
    sticker.className = 'active-sticker task-card';
    
    // 注入內容與自訂顏色
    sticker.innerHTML = `
        <div class="sticker-text" contenteditable="true">${typeText}</div>
    `;
    sticker.style.borderLeft = `6px solid ${color}`;
    
    // 隨機在中間稍微偏左的位置生成，避免全部疊在一起
    const randomOffset = Math.random() * 30;
    sticker.style.left = (50 + randomOffset) + 'px';
    sticker.style.top = (50 + randomOffset) + 'px';

  
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