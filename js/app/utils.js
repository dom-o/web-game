define ({
  randInt: function (max, min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    num = Math.floor(Math.random() * (max - min)) + min;
    console.log(min + " "+ max);
    return num;
  }
});
