define(['./utils', 'matter'], function(utils, Matter){
  return function (x, y, radius, maxHealth, movementPattern) {
    return {
      radius: radius,
      maxHealth: maxHealth,
      health: maxHealth,
      movementPattern: movementPattern,
      body: Matter.Bodies.circle(x, y, radius, {
        // friction: 0,
        // frictionAir: 0,
        // frictionStatic: 0,
        restitution: 1,
        inertia: Infinity
      }),
      draw: function(ctx){
        tmpFill = ctx.fillStyle;
        ctx.fillStyle = 'black';
        utils.drawByVertices(this.body, ctx);

        // draw health
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(this.body.position.x, this.body.position.y, this.body.circleRadius*0.75, 0, 2*Math.PI*(this.health/this.maxHealth));
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = tmpFill;
      }
    }
  };
});
