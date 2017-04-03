define(['./utils', 'matter'], function(utils, Matter){
  return function (x, y, radius, hitsWalls) {
    return {
      colls: 0,
      minSpeed: 2,
      maxSpeed: 30,
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
        direction = utils.vectorNormalize(this.body.velocity.x, this.body.velocity.y);
        speed = this.getSpeed(this.colls);
        newVelocity = {
          x: direction.x*speed,
          y: direction.y*speed
        };
        Matter.Body.setVelocity(this.body, newVelocity);
      },
      getSpeed: function(t) {
        C= this.maxSpeed - this.minSpeed;
        k= -( Math.log( 1-((C-0.0001)/C) ) / 60);
        return C*(1-Math.exp(-k*t)) + this.minSpeed;
      },
      draw: function(ctx){
        tmpFill = ctx.fillStyle;
        ctx.fillStyle = this.color;
        utils.drawByVertices(this.body, ctx);

        //draw movement vector
        ctx.beginPath();
        ctx.moveTo(this.body.position.x, this.body.position.y);
        ctx.lineTo(this.body.position.x+(this.body.velocity.x*this.body.speed*5), this.body.position.y+(this.body.velocity.y*this.body.speed*5));
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = tmpFill;
      }
    }
  };
});
