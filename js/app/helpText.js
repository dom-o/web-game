define({
  i: 0,
  texts: ["Click to place nodes", "Hold 0 and 1", "Now hold 9 and 4", "The blue ball wil bounce off the red lines", "The green ball won't", "The green ball won't", "Use the walls to hit the green ball with the blue ball"],
  draw: function(ctx) {
    ctx.fillStyle = 'red';
    ctx.font = '75px arial';
    ctx.textAlign = 'left';
    if(this.i < this.texts.length){
      ctx.fillText(this.texts[this.i], 100, 100);
    }
  }
});
