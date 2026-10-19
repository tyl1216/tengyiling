# 网页抓小球小游戏 —— 项目复盘（retrospective.md）

> 创建日期：2026-10-19
> 项目：原生 HTML + CSS + JS 网页抓小球小游戏
> 技术栈：无框架、无构建工具、纯 ES6+

---

## 1. 项目完成情况

| 阶段 | 产出 | 状态 |
|------|------|------|
| Brainstorming | spec.md 需求规格文档 | ✅ 已确认 |
| Writing-Plans | plan.md 7 任务渐进式拆解 | ✅ 已确认 |
| TDD-T1 | index.html + style.css 页面骨架 | ✅ 手动验证通过 |
| TDD-T2 | script.js 状态机 + 开始按钮 | ✅ 手动验证通过 |
| TDD-T3 | 小球渲染 + refreshBall() 共享函数 | ✅ 手动验证通过 |
| TDD-T4 | 点击交互 + 分数更新 | ✅ 手动验证通过 |
| TDD-T5 | +2/−1 飘字动效 | ✅ 手动验证通过 |
| TDD-T6 | 倒计时 + 结束蒙层 | ✅ 手动验证通过 |
| TDD-T7 | 再来一局重置 + 全流程回归 | ✅ 手动验证通过 |
| Git 提交 | 4 次分阶段 commit | ✅ 见下方 |

---

## 2. 技术决策亮点

### 2.1 refreshBall() 共享函数设计
点球和点空白**共用同一条小球刷新路径**，核心函数 `refreshBall()` 统一处理：
- 淡出旧小球 → `animationend` 监听 → 移除 → 计算随机坐标 → 创建新小球 → 淡入
- 避免了两条路径重复写"淡出→新位置→淡入"的逻辑

### 2.2 事件委托 + 状态守卫
- 游戏区域用**事件委托**（单一 click 监听），通过 `event.target.classList.contains('ball')` 判断点球/点空白
- 状态守卫 `if (gameState !== 'playing') return` 确保 idle/ended 时点击无响应

### 2.3 去重保护
`refreshBall()` 检测到小球正在淡出时（`.out` 类存在），跳过动画直接移除重建——防止快速连点时多个 `animationend` 监听器堆叠。

### 2.4 飘字 auto-cleanup
飘字 DOM 在 `animationend` 后自动 `remove()`——无需手动清理、无内存泄漏风险。

---

## 3. 遇到的边界问题

| 问题 | 发现阶段 | 修复方案 |
|------|---------|---------|
| 快速连续点击导致多个小球/监听器堆叠 | T4 编码时（review 提前发现） | `refreshBall()` 加 `.out` 类检测去重保护 |
| 扣分出现负数 | Brainstorming 差异对比 | `Math.max(0, score - 1)` 最低 0 分 |
| 点空白小球行为不明 | Brainstorming 差异对比 | 确认与点球一样都调 `refreshBall()` |
| resetGame 残留 interval 继续 tick | T7 编码时 | 每次 reset 都 `clearInterval` + `timerInterval = null` |
| 倒计时格式补零 | T6 编码时 | `String(n).padStart(2, '0')` |

---

## 4. 渐进式任务拆解的成效

✅ **每一步都可独立验证**：T1 纯 HTML/CSS 静态页面 → 不依赖任何 JS，能单独测  
✅ **共享函数先行**：`refreshBall()` 在 T3 实现，T4 两个分支直接复用  
✅ **空壳占位 + TODO**：后续任务从 T2 空壳逐步填充，代码始终可运行  
✅ **不做过度设计**：TDD 人工验收为主（前端网页合理选择），不引入 Jest/Vitest  

---

## 5. 原生前端开发经验

1. **`requestAnimationFrame` 触发 CSS 动画**：创建元素后下一帧再加动画类，确保浏览器把"无动画→有动画"识别为状态切换
2. **`animationend` 事件**：关键帧动画结束回调，需检查 `e.animationName` 防止多个动画事件混淆
3. **viewport 坐标转相对坐标**：`e.clientX - element.getBoundingClientRect().left`
4. **`padStart(2, '0')`**：MM:SS 两位数补零的最佳方案
5. **`pointer-events: none`**：飘字/遮罩等覆盖层设为 none，点击可透传到下层

---

## 6. 可扩展方向（不在本次 scope）

- localStorage 持久化最高分排行榜
- 音效（点球 +2 清脆 / 点空白 -1 沉闷）
- 难度递增（60s 后小球尺寸变小 / 刷新速度加快）
- 移动端触控适配（viewport 已设，但 cursor: crosshair 在手机上不需要）
- 多球模式（同时 2~3 个小球）

---

## 7. 最终文件清单

```
.trae/
├── index.html          # 页面骨架（T1）
├── style.css           # 全部样式（T1/T3/T5）
├── script.js           # 全部交互逻辑（T2~T7）
├── spec.md             # 需求规格文档（Brainstorming）
├── plan.md             # 任务拆解文档（Writing-Plans）
└── retrospective.md    # 本复盘文档
```

---

> 🏁 **项目结束。全流程严格遵守课程版 Superpowers 规范：Brainstorming → Writing-Plans → TDD → Code-Review → Manual Verification → Git。**
