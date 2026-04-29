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

// --- 1. 自行輸入任務的函式 (找回來的！) ---
function createTaskSticker() {
    const text = prompt("請輸入任務內容：");
    if (!text || text.trim() === "") return;
    // 呼叫下方的統一樣式函式，給它一個預設顏色（例如灰色）
    createTaskByType(text, '#666');
}

// --- 2. 預設類型任務標籤 (獨立出來) ---
function createTaskByType(typeText, color) {
    const canvas = document.getElementById('sticker-canvas');
    if (!canvas) return;

    const sticker = document.createElement('div');
    sticker.className = 'active-sticker task-card';
    
    sticker.innerHTML = `
        <div class="sticker-text" contenteditable="true">${typeText}</div>
    `;
    sticker.style.borderLeft = `6px solid ${color}`;
    
    // 隨機初始位置
    const randomOffset = Math.random() * 50;
    sticker.style.left = (50 + randomOffset) + 'px';
    sticker.style.top = (50 + randomOffset) + 'px';

    canvas.appendChild(sticker);
    addDragListeners(sticker);

    // 處理編輯文字時不觸發拖拽
    const textElement = sticker.querySelector('.sticker-text');
    textElement.addEventListener('mousedown', (e) => e.stopPropagation());
    textElement.addEventListener('touchstart', (e) => e.stopPropagation());
}

// --- 3. PNG/Emoji 能量貼紙 (修正結構) ---
function createSticker(type) {
    const canvas = document.getElementById('sticker-canvas');
    if (!canvas) return;

    const sticker = document.createElement('div');
    sticker.className = 'active-sticker';
    
    const icons = { 
        high: '分心.png',
        anxi: '焦慮.png',
        lopie: '內耗.png',
        avoid: '逃避.png', 
        perfy: 'IP(1).png', 
        
    };

    const content = icons[type] || type;

    if (content.endsWith('.png') || content.endsWith('.jpg')) {
        const img = document.createElement('img');
        img.src = content;
        img.style.width = '55px'; 
        img.style.pointerEvents = 'none'; 
        sticker.appendChild(img);
    } else {
        sticker.innerText = content;
        sticker.style.fontSize = '35px';
    }

    sticker.style.left = '100px';
    sticker.style.top = '100px';

    addDragListeners(sticker);
    canvas.appendChild(sticker);
}

// --- 4. 核心：拖拽邏輯 ---
function addDragListeners(el) {
    el.addEventListener('mousedown', startDragging);
    el.addEventListener('touchstart', startDragging, { passive: false });
}

function startDragging(e) {
    // 如果正在編輯文字，不要觸發拖拽
    if (e.target.contentEditable === "true") return;

    // 確保抓到的是貼紙容器本體
    activeElement = e.currentTarget; 
    
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    const rect = activeElement.getBoundingClientRect();
    offset.x = clientX - rect.left;
    offset.y = clientY - rect.top;

    activeElement.style.zIndex = 1000; // 拖動時置頂

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
}

function drag(e) {
    if (!activeElement) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const canvasRect = document.getElementById('sticker-canvas').getBoundingClientRect();
    activeElement.style.left = (clientX - canvasRect.left - offset.x) + 'px';
    activeElement.style.top = (clientY - canvasRect.top - offset.y) + 'px';
}

function stopDragging() {
    if (activeElement) activeElement.style.zIndex = 100;
    activeElement = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
}