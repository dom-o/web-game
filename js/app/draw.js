define(['./utils'], function(utils) {
  return {
    styles: [
      function(ctx){
        tmpFill = ctx.fillStyle;
        ctx.fillStyle = 'black';
        utils.drawByVertices(this.body, ctx);

        healthPercent = (this.health*0.9)/this.maxHealth;

        // draw health
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.body.position.x, this.body.position.y, this.body.circleRadius*0.75, 0, 2*Math.PI*healthPercent, true);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(this.body.position.x, this.body.position.y, this.body.circleRadius*0.75, 0, 2*Math.PI*healthPercent);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = tmpFill;
      },
      function(ctx) {
        tmpFill = ctx.fillStyle;
        ctx.fillStyle = 'black';
        utils.drawByVertices(this.body, ctx);

        ctx.fillStyle = tmpFill;
      }
    ]
  }
});
