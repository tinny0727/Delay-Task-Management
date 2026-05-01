// 移除舊的容器避免重複
// 建立一個簡單的「啵」聲音頻
const trashAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); 
// 或者找一個你喜歡的音效網址替換
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
// --- 1. 修改：新增可選顏色的函式 ---
// 修改後的顏色標籤函式
// --- 改良版：數字、文字、隨機通吃的選色函式 ---
function createTaskSticker() {
    const text = prompt("請輸入任務內容：");
    if (!text || text.trim() === "") return;

    // 定義顏色庫
    const colorMap = {
        'R': { name: '紅色', value: '#ff6b6b' },
        'B': { name: '藍色', value: '#4dabf7' },
        'Y': { name: '金色', value: '#ffd43b' },
        'P': { name: '紫色', value: '#be4bdb' },
        'G': { name: '嫩綠', value: '#8ce99a' },
       
    };

    // 建立提示文字
    let colorHint = "請選擇標籤顏色：\n";
    for (let key in colorMap) {
        colorHint += `${key}. ${colorMap[key].name}  `;
    }
    colorHint += "\n(直接輸入數字，留空則隨機選色)";

    const choice = prompt(colorHint);
    
    let finalColor;
    if (colorMap[choice]) {
        // 使用者選了對應數字
        finalColor = colorMap[choice].value;
    } else if (!choice || choice.trim() === "") {
        // 留空則從現有顏色隨機選一個
        const keys = Object.keys(colorMap);
        finalColor = colorMap[keys[Math.floor(Math.random() * keys.length)]].value;
    } else {
        // 如果使用者隨便打，就讓它變成灰色或自定義顏色
        finalColor = '#666'; 
    }

    createTaskByType(text, finalColor);
}
// --- 4. 核心：修改拖拽邏輯以支援回收 ---
function stopDragging(e) {
    if (!activeElement) return;

    const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientY;
    const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;

    activeElement.style.pointerEvents = 'none'; 
    const dropTarget = document.elementFromPoint(clientX, clientY);
    activeElement.style.pointerEvents = 'auto'; 

    const trashCan = dropTarget ? dropTarget.closest('#trash-can') : null;

    if (trashCan) {
        // --- 播放音效 ---
        trashAudio.currentTime = 0; // 每次重頭播放，連續丟才不會沒聲
        trashAudio.play().catch(err => console.log("聲音播放失敗：", err));

        // --- 消失動畫 ---
        activeElement.style.transition = 'all 0.2s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
        activeElement.style.transform = 'scale(0) translateY(50px) rotate(30deg)';
        activeElement.style.opacity = '0';
        
        const target = activeElement;
        setTimeout(() => target.remove(), 250);
        
        trashCan.classList.remove('hover');
    }



    if (activeElement) activeElement.style.zIndex = 100;
    activeElement = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDragging);
    document.removeEventListener('touchend', stopDragging);
}

// 在 drag 函式中加入視覺反饋
function drag(e) {
    if (!activeElement) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const canvasRect = document.getElementById('sticker-canvas').getBoundingClientRect();
    activeElement.style.left = (clientX - canvasRect.left - offset.x) + 'px';
    activeElement.style.top = (clientY - canvasRect.top - offset.y) + 'px';

    // 檢查是否碰到垃圾桶 (增加視覺效果)
    const trashCan = document.getElementById('trash-can');
    if (trashCan) {
        const trashRect = trashCan.getBoundingClientRect();
        if (clientX > trashRect.left && clientX < trashRect.right &&
            clientY > trashRect.top && clientY < trashRect.bottom) {
            trashCan.classList.add('hover');
        } else {
            trashCan.classList.remove('hover');
        }
    }
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

function stopDragging(e) {
    if (!activeElement) return;

    // 取得放開位置的座標
    const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;

    // 先暫時隱藏被拖動的元素，否則 elementFromPoint 永遠只會抓到標籤自己
    activeElement.style.display = 'none';
    const dropTarget = document.elementFromPoint(clientX, clientY);
    activeElement.style.display = 'block';

    // 檢查底下是不是垃圾桶 (透過 ID 或 Class)
    const trashCan = dropTarget ? dropTarget.closest('#trash-can') : null;

    if (trashCan) {
        // 播放一點縮小動畫然後移除
        activeElement.style.transition = 'all 0.2s';
        activeElement.style.transform = 'scale(0) rotate(20deg)';
        activeElement.style.opacity = '0';
        
        const targetToRemove = activeElement;
        setTimeout(() => targetToRemove.remove(), 200);
        trashCan.classList.remove('hover');
    } else {
        activeElement.style.zIndex = 100;
    }

    activeElement = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDragging);
    document.removeEventListener('touchend', stopDragging);
}