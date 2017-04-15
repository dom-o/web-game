define(['./utils', 'matter'], function(utils, Matter){
  return function (x, y, radius, minSpeed, maxSpeed, rate, maxHealth) {
    return {
      colls: 0,
      minSpeed: minSpeed,
      maxSpeed: maxSpeed,
      rate: rate,
      radius: radius,
      // maxHealth: maxHealth,
      // health: maxHealth,
      genForce: function() {
        v = utils.vectorNormalize(Math.random(), Math.random());
        return {
          x: v.x * this.minSpeed,
          y: v.y * this.minSpeed
        };
      },
      body: Matter.Bodies.circle(x, y, radius, {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        restitution: 1,
        inertia: Infinity
      }),
      updateVelocity: function () {
        direction = utils.vectorNormalize(this.body.velocity.x, this.body.velocity.y);
        speed = this.getSpeed();
        newVelocity = {
          x: direction.x*speed,
          y: direction.y*speed
        };
        Matter.Body.setVelocity(this.body, newVelocity);
        // Matter.Body.setAngle(this.body, 0);
      },
      getSpeed: function() {
        return ;
      },
      draw: function(ctx){
        tmpFill = ctx.fillStyle;
        ctx.fillStyle = 'black';
        utils.drawByVertices(this.body, ctx);

        // draw health
        // ctx.beginPath();
        // ctx.fillStyle = 'red';
        // ctx.arc(this.body.position.x, this.body.position.y, this.body.circleRadius*0.75, 0, 2*Math.PI*(this.health/this.maxHealth));
        // ctx.fill();
        // ctx.closePath();

        //draw movement vector
        // ctx.beginPath();
        // ctx.moveTo(this.body.position.x, this.body.position.y);
        // ctx.lineTo(this.body.position.x+(this.body.velocity.x*this.body.speed*5), this.body.position.y+(this.body.velocity.y*this.body.speed*5));
        // ctx.stroke();
        // ctx.closePath();

        ctx.fillStyle = tmpFill;
      }
    }
  };
});
