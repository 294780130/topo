const util = {
  getCoordinate: function getCoordinate(rectInfo) {
    return {
      p1: [rectInfo.x, rectInfo.y],
      p2: [rectInfo.x + rectInfo.width, rectInfo.y],
      p3: [rectInfo.x + rectInfo.width, rectInfo.y + rectInfo.height],
      p4: [rectInfo.x, rectInfo.y + rectInfo.height],
    }
  },
  getCentralPoint: function getCentralPoint(rect) {
    return [(rect.p1[0] + rect.p2[0]) / 2, (rect.p1[1] + rect.p4[1]) / 2]
  },
}

export default util
