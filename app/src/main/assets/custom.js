window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ==============================================
// 1. 【核心】页面加载前就伪装成电脑设备
// ==============================================
(function() {
    // 强制修改 User-Agent
    Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        writable: false,
        configurable: false
    });

    // 强制修改屏幕尺寸
    Object.defineProperty(screen, 'width', { value: 1920, configurable: false });
    Object.defineProperty(screen, 'height', { value: 1080, configurable: false });
    Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: false });
    Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: false });
})();

// ==============================================
// 2. 强制删除手机版样式，恢复电脑布局
// ==============================================
const fixLayout = setInterval(() => {
    const html = document.documentElement;
    // 删除网页的手机版标记类
    if (html.classList.contains('mobile-view')) {
        html.classList.remove('mobile-view');
    }
    // 强制设置为桌面宽高，禁止自适应手机
    html.style.width = '100%';
    html.style.height = '100%';
    html.style.maxWidth = '1920px';
    html.style.maxHeight = '1080px';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
}, 100);

// 页面加载后停止检测
window.addEventListener('load', () => clearInterval(fixLayout));

// ==============================================
// 3. 修复链接跳转问题（防止新窗口打不开）
// ==============================================
const hookClick = (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.target === '_blank') {
        e.preventDefault();
        location.href = link.href;
    }
};
window.open = (url) => location.href = url;
document.addEventListener('click', hookClick, { capture: true });

// ==============================================
// 4. 遥控器适配：高亮+按键控制
// ==============================================
// 给选中元素加高亮边框，一眼看到遥控器在哪
const style = document.createElement('style');
style.textContent = `
    *:focus {
        outline: 3px solid #ff6b6b !important;
        outline-offset: 4px !important;
        box-shadow: 0 0 15px rgba(255, 107, 107, 0.6) !important;
    }
    /* 强制横屏，禁止竖屏样式 */
    @media (orientation: portrait) {
        html, body { transform: rotate(90deg); transform-origin: center; width: 100vh !important; height: 100vw !important; }
    }
`;
document.head.appendChild(style);

// 遥控器按键映射
document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    // 左右键控制进度条/音量条
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && active.type === 'range') {
        e.preventDefault();
        const step = e.key === 'ArrowLeft' ? -5 : 5;
        active.value = Math.max(0, Math.min(100, parseInt(active.value) + step));
        active.dispatchEvent(new Event('input', { bubbles: true }));
    }
    // 无选中时，按OK键直接播放/暂停
    if (e.key === 'Enter' && active === document.body) {
        document.querySelector('button[aria-label="播放/暂停"], .play-btn')?.click();
    }
});

// 页面加载后，默认聚焦播放按钮，遥控器一开就能控制
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('button[aria-label="播放/暂停"], .play-btn')?.focus();
    }, 1500);
});