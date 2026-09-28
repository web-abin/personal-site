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

  /** 相邻作品卡片的横向距离（px）。 */
  cardSpacing: 560,

  /** 首尾卡片完全离开屏幕后，额外留在边缘外的距离（px）。 */
  cardOffscreenPadding: 180,

  /** 卡片开始与结束横向运动的滚动进度，避开开场和收场。 */
  cardTravelRange: {
    start: 0.28,
    end: 0.7,
  },

  /** 作品播放完成并恢复胶囊后，胶囊向上退场的滚动区间。 */
  capsuleExitRange: {
    start: 0.89,
    end: 1,
  },

  /** 点阵在一次作品墙滚动区间内的漂移距离（px）。 */
  dotDriftSpeed: 42,

  /**
   * 卡片所在的水平圆柱半径（px）。
   * 数值越大曲面越平，越小则边缘透视越强。
   */
  cardCylinderRadius: 2600,

  /** 两排卡片向曲面外侧倾斜的最大角度。 */
  cardBankMax: 2.6,

  /** 上下两排的轻微俯仰透视。 */
  cardPitchMax: 1.1,
} as const;
