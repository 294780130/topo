class GetCrossPoint {
  /**
   * 获取线和矩形的交点
   * @param  {Object} lineCoor 线的两个点，每个点的坐标都是数组的形式
   * @param  {Object} rectCoor 矩形的四个点，形式和上面的一样
   */

  static lineRect(lineCoor, rectCoor) {
    let res
    let rectEdge = [
      [rectCoor.p1, rectCoor.p2],
      [rectCoor.p2, rectCoor.p3],
      [rectCoor.p3, rectCoor.p4],
      [rectCoor.p4, rectCoor.p1],
    ]
    let line = [lineCoor.p1, lineCoor.p2]
    rectEdge.forEach((edge) => {
      let result = this.calculatePoint(...line, ...edge)
      if (result) {
        res = result
      }
    })
    return res
  }

  //获取线和边的交叉点
  static calculatePoint(a, b, c, d) {
    // 三角形abc 面积的2倍
    var area_abc = (a[0] - c[0]) * (b[1] - c[1]) - (a[1] - c[1]) * (b[0] - c[0])

    // 三角形abd 面积的2倍
    var area_abd = (a[0] - d[0]) * (b[1] - d[1]) - (a[1] - d[1]) * (b[0] - d[0])

    // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
    if (area_abc * area_abd >= 0) {
      return false
    }

    // 三角形cda 面积的2倍
    var area_cda = (c[0] - a[0]) * (d[1] - a[1]) - (c[1] - a[1]) * (d[0] - a[0])
    // 三角形cdb 面积的2倍
    // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
    var area_cdb = area_cda + area_abc - area_abd
    if (area_cda * area_cdb >= 0) {
      return false
    }

    //计算交点坐标
    var t = area_cda / (area_abd - area_abc)
    var dx = t * (b[0] - a[0]),
      dy = t * (b[1] - a[1])
    return [a[0] + dx, a[1] + dy]
  }
}

export default GetCrossPoint
