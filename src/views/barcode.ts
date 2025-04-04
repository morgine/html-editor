import JsBarcode from 'jsbarcode'

export type generateBarcodeOptions = {
  ltText: string
  lbText: string
  rtText: string
  rbText: string
  tcText: string
  bcText: string
}

export function generateBarcode(data: string, opts?: Partial<generateBarcodeOptions>): SVGSVGElement | null {
  const { ltText, lbText, rtText, rbText, tcText, bcText } = opts || {}
  // 创建用于存储条码的 SVG 元素
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const singleBarWidth = 4
  const barHeight = 64
  const totalHeight = 64 * 2.5
  const rectPadding = 12
  const rectBorderWidth = 1
  const barsYPadding = (totalHeight - barHeight) / 2
  const barsWidth = 112 * singleBarWidth
  const totalWidth = totalHeight * 3.5
  const barsXPadding = (totalWidth - barsWidth) / 2
  const rectWidth = totalWidth - rectPadding * 2
  const rectHeight = totalHeight - rectPadding * 2
  const rectTranslateX = rectPadding
  const rectTranslateY = rectPadding
  JsBarcode(svg, data, {
    format: "CODE128",  // 编码格式
    width: singleBarWidth,
    height: barHeight,
    margin: 0,
    displayValue: false // 显示文本
  });

  const targetSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  targetSVG.setAttribute('width', totalWidth.toString())
  targetSVG.setAttribute('height', totalHeight.toString())
  targetSVG.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`)

  const backgroundRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  backgroundRect.setAttribute('width', totalWidth.toString())
  backgroundRect.setAttribute('height', totalHeight.toString())
  backgroundRect.setAttribute('fill', 'transparent')

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute('width', rectWidth.toString())
  rect.setAttribute('height', rectHeight.toString())
  rect.setAttribute('fill', 'transparent')
  rect.setAttribute('stroke', 'black')
  rect.setAttribute('stroke-width', rectBorderWidth.toString())
  rect.setAttribute('transform', `translate(${rectTranslateX}, ${rectTranslateY})`)

  const g = svg.querySelector('g')
  if (!g) {
    throw new Error('bars group not found')
  }
  const bars = g.cloneNode(true) as SVGGElement
  bars.setAttribute('transform', `translate(${barsXPadding}, ${barsYPadding})`)
  targetSVG.appendChild(backgroundRect)
  targetSVG.appendChild(rect)
  targetSVG.appendChild(bars)
  const fontSize = 16
  const fontPadding = 10
  const leftX = barsXPadding - fontPadding
  const rightX = barsXPadding + barsWidth + fontPadding
  const topY = barsYPadding - fontPadding * 1.25
  const bottomY = barsYPadding + barHeight + fontPadding + fontSize
  const centerX = barsXPadding + barsWidth / 2
  if (ltText) {
    const leftTopText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    leftTopText.setAttribute('x', `${leftX}`)
    leftTopText.setAttribute('y', `${topY}`)
    leftTopText.setAttribute('font-size', `${fontSize}`)
    leftTopText.setAttribute('font-weight', 'bold')
    leftTopText.textContent = ltText
    leftTopText.setAttribute('text-anchor', 'start')
    targetSVG.appendChild(leftTopText)
  }
  if (lbText) {
    const leftBottomText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    leftBottomText.setAttribute('x', `${leftX}`)
    leftBottomText.setAttribute('y', `${bottomY}`)
    leftBottomText.setAttribute('font-size', `${fontSize}`)
    leftBottomText.setAttribute('font-weight', 'bold')
    leftBottomText.setAttribute('line-height', '1')
    leftBottomText.textContent = lbText
    leftBottomText.setAttribute('text-anchor', 'start')
    targetSVG.appendChild(leftBottomText)
  }
  if (rtText) {
    const rightTopText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    rightTopText.setAttribute('x', `${rightX}`)
    rightTopText.setAttribute('y', `${topY}`)
    rightTopText.setAttribute('font-size', `${fontSize}`)
    rightTopText.setAttribute('font-weight', 'bold')
    rightTopText.textContent = rtText
    rightTopText.setAttribute('text-anchor', 'end')
    targetSVG.appendChild(rightTopText)
  }
  if (rbText) {
    const rightBottomText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    rightBottomText.setAttribute('x', `${rightX}`)
    rightBottomText.setAttribute('y', `${bottomY}`)
    rightBottomText.setAttribute('font-size', `${fontSize}`)
    rightBottomText.setAttribute('font-weight', 'bold')
    rightBottomText.textContent = rbText
    rightBottomText.setAttribute('text-anchor', 'end')
    targetSVG.appendChild(rightBottomText)
  }
  if (tcText) {
    const topCenterText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    topCenterText.setAttribute('x', `${centerX}`)
    topCenterText.setAttribute('y', `${topY}`)
    topCenterText.setAttribute('font-size', `${fontSize}`)
    topCenterText.setAttribute('font-weight', 'bold')
    topCenterText.textContent = tcText
    topCenterText.setAttribute('text-anchor', 'middle')
    targetSVG.appendChild(topCenterText)
  }
  if (bcText) {
    const bottomCenterText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    bottomCenterText.setAttribute('x', `${centerX}`)
    bottomCenterText.setAttribute('y', `${bottomY}`)
    bottomCenterText.setAttribute('font-size', `${fontSize}`)
    bottomCenterText.setAttribute('font-weight', 'bold')
    bottomCenterText.textContent = bcText
    bottomCenterText.setAttribute('text-anchor', 'middle')
    targetSVG.appendChild(bottomCenterText)
  }
  return targetSVG
}
