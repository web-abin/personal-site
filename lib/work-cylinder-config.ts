/**
 * Work 作品墙动效统一配置。
 *
 * 修改这里即可调整首页 Work 模块；public/demo/anim.html 只是独立演示页，
 * 不会参与首页渲染。
 */
export const WORK_CYLINDER_CONFIG = {
  /** 字母汇聚状态下的基础高度（px）。 */
  letterMinHeight: 132,

  /** 字母完全展开后的基础高度（px）。 */
  letterMaxHeight: 174,

  /** 屏幕水平中心处，相邻两行中心文字边缘之间的垂直净距（px）。 */
  rowGap: -20,

  /** 负数令两侧上扬，正数令两侧下沉。 */
  curves: {
    W: -2,
    O: -0.3,
    R: 0.4,
    K: 2.5,
  },

  /** 四行完全展开后的统一总宽度（px），保证左右边界对齐。 */
  letterRowSpan: 2664,

  /** 字形宽度不同，因此每行用不同数量维持接近原设计的字间距。 */
  letterCounts: {
    W: 19,
    O: 23,
    R: 25,
    K: 21,
  },

  /** 滚动时每一行字母的水平循环速度倍率。 */
  scrollSpeeds: {
    W: 0.2,
    O: 0.14,
    R: 0.15,
    K: 0.2,
  },

  /** 作品墙状态下字母向屏幕两侧放大的梯度；0 表示所有字母完全等大。 */
  letterEdgeScaleSpeed: 0.08,

  /** 卡片间距相对视口的比例，保证桌面端同屏最多两张。 */
  cardSpacingViewport: 0.54,

  /** 卡片间距相对自身宽度的最小倍数，避免窄屏重叠。 */
  cardSpacingWidth: 2,

  /** 首尾卡片完全离开屏幕后，额外留在边缘外的距离（px）。 */
  cardOffscreenPadding: 120,

  /** 卡片开始与结束横向运动的滚动进度，避开开场和收场。 */
  cardTravelRange: {
    start: 0.28,
    end: 0.7,
  },

  /** 点阵在一次作品墙滚动区间内的漂移距离（px）。 */
  dotDriftSpeed: 42,

  /**
   * 卡片所在的水平圆柱半径（px）。
   * 数值越大曲面越平，越小则边缘透视越强。
   */
  cardCylinderRadius: 3000,

  /** 中心缓行区占视口宽度的比例。 */
  cardCenterSlowZone: 0.62,

  /** 中心最慢速度与边缘速度的混合权重。 */
  cardCenterLinearWeight: 0.24,

  /** 中心缓行曲线指数；越大越有“呼吸驻留”感。 */
  cardCenterEasePower: 1.72,

  /** 卡片到达中心时的缩小比例，形成中间远、两侧近的空间感。 */
  cardCenterScale: 0.97,

  /** 卡片到达中心时沿 Z 轴后退的距离（px）。 */
  cardCenterDepth: 35,

  /** 滚轮停止后卡片追上目标位置的时长（秒）。 */
  cardInertiaDuration: 0.28,

  /** 两排卡片向曲面外侧倾斜的最大角度。 */
  cardBankMax: 1.55,

  /** 上下两排的轻微俯仰透视。 */
  cardPitchMax: 0.7,
} as const;
