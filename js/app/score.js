define({
  num: 0,
  draw: function(ctx) {
    ctx.fillStyle = 'black';
    ctx.font = "40px arial"
    ctx.fillText(this.num, 50, 50);
  }
});
