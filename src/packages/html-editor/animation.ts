interface AnimationOptions {
  duration?: number
  easing?: (t: number) => number
  onFinish?: () => void,
}

export function animate(
  from: number[],
  to: number[],
  update: (current: number[], progress: number) => void,
  options?: AnimationOptions
): () => void {
  // 参数校验
  if (from.length !== to.length) {
    throw new Error('From/to arrays must have same length')
  }

  // 合并配置
  const {
    duration = 1000,
    easing = (t: number) => t,
    onFinish
  } = options || {}

  // 动画状态
  let startTime: number | null = null
  let cancelled = false
  const deltas = to.map((t, i) => t - from[i])

  // 动画帧循环
  const step = (timestamp: number) => {
    if (cancelled) return

    // 初始化开始时间
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime

    // 计算进度 (0~1)
    let progress = Math.min(elapsed / duration, 1)
    progress = easing(progress)

    // 计算当前值
    const current = from.map((f, i) => f + deltas[i] * progress)

    // 执行更新
    update(current, progress)

    // 继续循环或结束
    if (progress < 1) {
      requestAnimationFrame(step)
    } else if (onFinish) {
      onFinish()
    }
  }

  // 启动动画
  requestAnimationFrame(step)

  // 返回取消函数
  return () => {
    cancelled = true
  }
}
