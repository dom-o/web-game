define(['./utils'], function(utils){
  return function (x, y, vx, vy, speed, radius, mass, color, hitsWalls) {
    return {
      x:x,
      y:y,
      vx: vx,//utils.normalize(2),
      vy: vy,//utils.normalize(2),
      speed: speed,
      radius: radius,
      mass: mass,
      color:color,
      hitsWalls: hitsWalls,
      hasMoved: false,
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
        this.vx = x;//utils.normalize(x);
        this.vy = y;//utils.normalize(y);
        this.speed = s;
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
