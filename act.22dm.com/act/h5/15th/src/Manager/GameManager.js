var GameManager = {
  cutDuration: 1,
  cutOpacity: 180,
  word: {
    part1: {
      x: 100,
      y: -50,
      d: 0.22,
      s: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [16, 17, 18, 19]]
    },
    part2: {
      x: 100,
      y: -50,
      d: 0.2,
      s: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11, 12], [13, 14, 15, 16, 17, 18, 19]]
    },
    part3: {
      x: 100,
      y: -50,
      d: 0.2,
      s: [[1, 2, 3, 4, 5, 6, 7, 8]]
    },
    part4: {
      x: 100,
      y: -100,
      d: 0.2,
      s: [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12, 13, 14, 15, 16], [17, 18, 19, 20, 21, 22]]
    },
    part5: {
      x: 100,
      y: -20,
      d: 0.2,
      s: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17, 18], [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], [31, 32, 33, 34, 35, 36, 37, 38, 39], [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]]
    },
    part7: {
      x: 100,
      y: -200,
      d: 0.2,
      s: [[1, 2, 3, 4], [5, 6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17, 18, 19]]
    }
  },
  reset: function () {
    winSize.music = "default";
  },
  getWordSetting: function (number) {
    let x = this.word[`part${number}`].x;
    let y = this.word[`part${number}`].y;
    let d = this.word[`part${number}`].d;
    let s = this.word[`part${number}`].s;
    return { s: s, x: x, y: y, d: d };
  },
  getCeilInt: function (max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};