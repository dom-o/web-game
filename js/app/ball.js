define(['./utils', 'matter'], function(utils, Matter){
  return function (x, y, radius, hitsWalls) {
    return {
      colls: 0,
      minSpeed: 0.001,
      maxSpeed: 0.02,
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
        restitution: 1
      }),
      radius: radius,
      hitsWalls: hitsWalls,

      move: function() {
        this.hasMoved = true;
        this.moveX();
        this.moveY();
      },
      moveX: function () {
        this.hasMoved = true;
        this.x += this.vx*this.speed;
      },
      moveY: function () {
        this.hasMoved = true;
        this.y += this.vy*this.speed;
      },
      setVelocity: function(x, y, s) {
        norm = utils.vectorNormalize(x, y);
        mag = utils.vectorMag(x, y);

        this.vx = norm.x;
        this.vy = norm.y;
        s*mag<=this.maxSpeed
        ?
          s*mag>= this.minSpeed ?
            this.speed = s*mag
          :
            this.speed = minSpeed
        :
          this.speed = maxSpeed;
      },
      updateVelocity: function () {
        // console.log(this.colls);
        // console.log(this.body.velocity);
        direction = utils.vectorNormalize(this.body.velocity.x, this.body.velocity.y);
        speed = this.getSpeed(this.colls);
        newVelocity = {
          x: direction.x*speed,
          y: direction.y*speed
        };
        console.log(utils.vectorMag(newVelocity.x, newVelocity.y));
        Matter.Body.setVelocity(this.body, newVelocity);
      },
      getSpeed: function(t) {
        C= 0.02 - 0.001;
        k= -( Math.log( 1-(0.01899/C) ) / 15);
        return C*(1-Math.exp(-k*t)) + this.minSpeed;
      },
      draw: function(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        //draw movement vector
        // ctx.beginPath();
        // ctx.moveTo(this.x, this.y);
        // ctx.lineTo(this.x+(this.vx*this.speed), this.y+(this.vy*this.speed));
        // ctx.stroke();
        // ctx.closePath();
      }
    }
  };
});
