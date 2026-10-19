/* script.js — 网页抓小球小游戏
 * T2 阶段：游戏状态机 + 开始按钮
 * 后续 T3~T7 将逐步填充 refreshBall、点击交互、倒计时等
 */

// ========== 全局状态 ==========
let gameState = 'idle';   // 'idle' | 'playing' | 'ended'
let score = 0;
let timerInterval = null;
const GAME_DURATION = 120; // spec 确认：2 分钟 = 120 秒
let remainingSeconds = 0;

// ========== DOM 引用 ==========
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const overlay = document.getElementById('overlay');
const finalScoreEl = document.getElementById('finalScore');

// ========== 共享函数（空壳，后续任务实现） ==========

/**
 * 刷新小球（共享核心函数，点球和点空白都调它）
 * 1. 找到旧小球 → 触发淡出 → 等动画结束 → 移除
 * 2. 计算新随机坐标（扣除边界，防止溢出）
 * 3. 创建新小球 DOM → 淡入
 */
const BALL_SIZE = 50; // spec 确认的小球直径
const BALL_ANIM_DURATION = 300; // ms，与 CSS keyframes 时长一致

function refreshBall() {
    const oldBall = gameArea.querySelector('.ball');

    // 没有旧小球（游戏刚开始第一次渲染），直接创建新的
    if (!oldBall) {
        spawnNewBall();
        return;
    }

    // 去重保护：如果上一次刷新还没结束（小球还在淡出或刚创建完），
    // 直接移除旧小球，跳过动画，创建新的。
    // 这样快速连续点击不会导致多个小球或监听器堆叠。
    if (oldBall.classList.contains('out')) {
        oldBall.remove();
        spawnNewBall();
        return;
    }

    // 有旧小球：触发淡出动画
    oldBall.classList.remove('in');
    oldBall.classList.add('out');

    // 淡出结束后移除旧 DOM，再创建新小球
    oldBall.addEventListener('animationend', function onOutDone(e) {
        if (e.animationName !== 'ballOut') return; // 只关心淡出动画

        oldBall.remove();
        oldBall.removeEventListener('animationend', onOutDone);

        spawnNewBall();
    });
}

/**
 * 在随机位置创建新小球并淡入
 * 坐标计算要扣掉小球直径，保证完整显示在游戏区域内
 */
function spawnNewBall() {
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    // 随机 left/top：0 到 (区域尺寸 - 小球尺寸)
    const maxX = areaWidth - BALL_SIZE;
    const maxY = areaHeight - BALL_SIZE;
    const left = Math.floor(Math.random() * maxX);
    const top = Math.floor(Math.random() * maxY);

    // 创建小球 DOM
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.style.left = left + 'px';
    ball.style.top = top + 'px';

    gameArea.appendChild(ball);

    // 触发淡入动画（setTimeout 一个 tick，确保 class 切换生效）
    requestAnimationFrame(() => {
        ball.classList.add('in');
    });
}

/**
 * 更新顶部倒计时显示
 * 把总秒数格式化为 MM:SS（两位数补零）
 */
function updateTimerUI(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerEl.textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

// ========== 状态机函数 ==========

/**
 * 开始游戏
 * 切换 idle → playing：隐藏开始按钮、调用 refreshBall 渲染第一个小球
 */
function startGame() {
    gameState = 'playing';
    console.log('[startGame] 状态:', gameState);

    // 1. 隐藏开始按钮
    startBtn.classList.add('hidden');

    // 2. 清空旧小球（防止多次点击开始残留）
    gameArea.innerHTML = '';

    // 3. 重置倒计时 + 分数
    remainingSeconds = GAME_DURATION;
    score = 0;
    updateScoreUI();
    updateTimerUI(remainingSeconds);

    // 4. 隐藏旧蒙层（防止上一局的残留）
    overlay.classList.add('hidden');

    // 5. 渲染第一个小球
    refreshBall();

    // 6. 启动倒计时
    startTimer();
}

/**
 * 启动每秒递减的倒计时 interval
 */
function startTimer() {
    // 清除之前可能残留的 interval（防御性）
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(function tick() {
        remainingSeconds--;
        updateTimerUI(remainingSeconds);

        if (remainingSeconds <= 0) {
            endGame();
        }
    }, 1000);
}

/**
 * 倒计时归零：结束游戏 → 切换 ended 状态 → 显示结束蒙层
 */
function endGame() {
    gameState = 'ended';

    // 1. 停止倒计时
    clearInterval(timerInterval);
    timerInterval = null;

    // 2. 移除小球（淡出）
    const ball = gameArea.querySelector('.ball');
    if (ball) {
        ball.remove();
    }

    // 3. 写入最终分数 + 显示蒙层
    finalScoreEl.textContent = score;
    overlay.classList.remove('hidden');

    console.log('[endGame] 游戏结束，最终得分:', score);
}

/**
 * 重置到初始状态（idle）
 * 点击蒙层「再来一局」触发
 */
function resetGame() {
    // 1. 清除倒计时 interval（防止残留 tick 继续跑）
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // 2. 切换回 idle 状态
    gameState = 'idle';

    // 3. 分数归零 + UI 更新
    score = 0;
    updateScoreUI();

    // 4. 倒计时重置为 02:00（静止）
    remainingSeconds = GAME_DURATION;
    updateTimerUI(remainingSeconds);

    // 5. 隐藏结束蒙层
    overlay.classList.add('hidden');

    // 6. 恢复开始按钮可见
    startBtn.classList.remove('hidden');

    // 7. 清空游戏区域（小球 + 飘字残留）
    gameArea.innerHTML = '';

    console.log('[resetGame] 已重置到初始状态');
}

// ========== T4：点击交互 + 分数 UI ==========

/**
 * 更新顶部分数显示
 */
function updateScoreUI() {
    scoreEl.textContent = score;
}

/**
 * 游戏区域统一点击处理（事件委托）
 * - 点到小球 → +2 → refreshBall()
 * - 点到空白 → -1（最低0） → refreshBall()
 * - 只有 playing 状态才响应，idle/ended 直接 return
 */
gameArea.addEventListener('click', function onGameAreaClick(e) {
    // 状态守卫：不在游戏进行中，不处理点击
    if (gameState !== 'playing') return;

    // 判断点击目标：是否点中小球
    const hitBall = e.target.classList.contains('ball');

    if (hitBall) {
        // 点球：+2
        score += 2;
    } else {
        // 点空白：-1，最低 0
        score = Math.max(0, score - 1);
    }

    // 更新分数 UI
    updateScoreUI();

    // 点球和点空白 → 共享同一条小球刷新路径（spec 第 67 行确认）
    refreshBall();

    // T5：飘字反馈（启用 T4 预留的钩子）
    spawnFloatingScore(hitBall, e.clientX, e.clientY);
});

// ========== T5：飘字 (+2 / −1) 动效 ==========

const FLOAT_ANIM_DURATION = 500; // ms，与 CSS floatUp keyframes 时长一致

/**
 * 在指定坐标生成飘字 DOM 并启动 floatUp 动画
 * @param {boolean} hitBall - true=点球(+2)，false=点空白(-1)
 * @param {number} clientX - 点击的 viewport X 坐标
 * @param {number} clientY - 点击的 viewport Y 坐标
 */
function spawnFloatingScore(hitBall, clientX, clientY) {
    const text = hitBall ? '+2' : '-1';
    const cls = hitBall ? 'positive' : 'negative';

    // 把 viewport 坐标转成 gameArea 内的相对坐标
    const areaRect = gameArea.getBoundingClientRect();
    const left = clientX - areaRect.left;
    const top = clientY - areaRect.top;

    // 创建飘字 DOM
    const float = document.createElement('div');
    float.className = 'floating-score ' + cls;
    float.textContent = text;
    float.style.left = left + 'px';
    float.style.top = top + 'px';

    gameArea.appendChild(float);

    // 动画结束后自动移除，防止 DOM 泄漏
    float.addEventListener('animationend', function onFloatDone(e) {
        if (e.animationName !== 'floatUp') return;
        float.remove();
        float.removeEventListener('animationend', onFloatDone);
    });
}

console.log('[script.js] T5 已加载（飘字动效就绪）');
