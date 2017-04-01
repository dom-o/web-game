define ({
  randInt: function (max, min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    num = Math.floor(Math.random() * (max - min)) + min;
    console.log(min + " "+ max);
    return num;
  },
  vectorMag: function(x, y) {
    return Math.sqrt((x*x) + (y*y));
  },
  vectorNormalize: function(x, y) {
    m= this.vectorMag(x, y);
    m > 0 ?
      r= {x:x/m, y:y/m}
    :
      r= {x:x, y:y};
    console.log(r);
    return r;
  }
});
