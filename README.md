# 王俊彬 · 个人网站

暗色个人作品集 MVP，PC 版心最大 1700px，同时适配窄屏。

## 本地运行

```sh
npm install
npm run dev
```

打开终端中 Local 对应的网址。默认 3000 端口占用时会自动选择其他端口。

## 页面

- `/` 首页：个人介绍、精选作品、经历、技术栈与优势
- `/works` 作品：分类筛选与非对称卡片展示
- `/works/[slug]` 详情：项目背景、职责、实现、数据与复盘
- `/about` 关于我：基本信息、经历、兴趣、联系方式

## 内容维护

项目资料集中在 `lib/portfolio.ts`。当前只有个人网站是实际在建项目，其余两项明确标为布局示例。个人经历、学校、账号与业务数据都保持待补充，不编造履历。首页文案在 `app/page.tsx`，关于我在 `app/about/page.tsx`，统一视觉在 `app/globals.css`。

## 验证

```sh
npm run build
npx tsc --noEmit
```

## Hero 圆形透视组件

组件：`components/hero-reveal.tsx`，独立样式：`components/hero-reveal.css`，动画与事件生命周期：`lib/hero-reveal-controller.ts`。

```tsx
import { HeroReveal } from '@/components/hero-reveal';

<HeroReveal
  baseImage="/images/hero-klaus-line.webp"
  revealImage="/images/hero-klaus-render.webp"
  alt="角色线稿，鼠标移动时显示完成稿"
  lensDiameter={260}
  follow={0.12}
  objectFit="contain"
  objectPosition="center"
>
  <h1>让想法发生。</h1>
</HeroReveal>
```

- `baseImage` 是静态底图，`revealImage` 是圆内显示的另一版本。替换时使用同尺寸、同构图、已对齐的图片。
- `lensDiameter` 单位为 CSS px。`follow` 默认 0.12，数值越大跟随越快；按帧间隔校正，避免不同刷新率改变手感。
- 两层使用同一 CSS 图片布局，外层 `clip-path` 限制上图区域。透明图片的上层背景会覆盖下图，避免线稿重影。
- 独立圆框挂到 `document.body`，不受 Hero 的裁剪/祖先 transform 影响；与圆形遮罩共用同一帧的位置和半径。
- pointermove 只记录目标坐标；RAF 更新 CSS Variables 和 transform，不触发 React setState。静止或退场完成后停止 RAF。
- scroll、resize、ResizeObserver 更新边界；失焦、后台、卸载清理；触屏禁用 Lens；减少动态效果时直接跟随、不做惯性或缩放过渡。
- 首页构图覆盖样式为 `app/globals.css` 中的 `.portfolio-reveal`；想复制为通用组件时无需带上这部分。
- 参考双图与作者来源见 `public/images/SOURCES.md`。当前用于本地动效演示，不作为个人作品。

运行交互控制器检查：`node --test tests/hero-reveal.test.mjs`。检查覆盖进出场、坐标同步、移动端、减少动态效果、资源失败和清理；未进行实机帧率测量。

## 首页重构：作品画廊

当前首页采用黑色底色、中文胶囊导航、透视作品卡片和大标题。画廊组件为 `components/home-gallery.tsx`，首页样式为 `app/home.css`。使用现有轮播组件和 Embla，支持拖拽、卡片区域滚轮切换、方向键、上一项/下一项按钮及触屏横向滑动。页面纵向滚动保持可用，滚轮切换仅在卡片区域内生效，页面其余区域正常滚动；卡片下方有继续浏览入口。

卡片数据继续引用 `lib/portfolio.ts`，点击进入现有作品详情。当前封面是中文界面占位设计，个人影像区域也是明确标注的占位区域。尊重减少动态效果设置，停止轮播时不持续执行动画帧。首页不再挂载上一版圆形透视组件，相关代码保留供后续复用。

## 最新交互：自由拖拽三维作品墙

首页画廊现已替换为 `lib/spatial-gallery-controller.ts` 控制的三维弧面作品墙，不再使用上一节的轮播逻辑。35 个展示位置循环引用现有 3 个项目，不代表新增作品。

- 按住鼠标：视野轻微拉远；向任意方向拖动：在连续弧面上移动卡片，卡片自身的 X/Y 透视角度随位置变化。
- 松手：根据释放速度继续惯性移动，无按卡片吸附；停住后动画帧休眠。
- 短点击进入项目；超过拖动阈值或长按不会打开链接。
- 普通纵向滚轮滚动页面；横向触控板或 Shift + 滚轮横向移动作品墙。
- 方向键平移，Home 或复位按钮恢复初始视角；触屏可拖动作品墙，在下方区域继续滚动页面。
- 降低动态效果时关闭惯性和按住缩放。卸载、失焦、移出视口时处理指针与动画生命周期。

检查命令：`node --test tests/spatial-gallery.test.mjs`。

## GSAP 滚动分镜

页面滚动动画统一由 `components/home-scroll-scenes.tsx` 管理，使用 `gsap`、`ScrollTrigger` 与 `@gsap/react` 的 `useGSAP`。后续新增滚动动画优先沿用这套组织方式。

PC 宽度至少 900px、高度至少 650px 时：首屏作品墙固定一段滚动距离并淡出标题；做事方式整屏固定，四个步骤依次进出场；经历、个人介绍分别以整屏分镜展开。滚动可逆，无自动播放或强制吸附。章节间通过默认 pinSpacing 保持连续文档流。

手机、小高度窗口保持正常页面滚动；减少动态效果模式显示静态完整内容。断点变化或离开页面时，通过 GSAP context/matchMedia 回收动画、固定容器与内联样式。三维作品墙自身的拖拽仍由独立空间控制器管理，不与 GSAP 同时写入同一变换属性。
