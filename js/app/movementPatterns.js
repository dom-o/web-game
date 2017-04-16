define(['./utils', 'matter'], function(utils, Matter){
  return {
    pattern: function(body, minSpeed, maxSpeed, pattern, args) {
      return {
        body: body,
        minSpeed: minSpeed,
        maxSpeed: maxSpeed,
        t:0,
        interval: -1,
        args: args,
        inited: false,
        init: this.patterns[pattern].init,
        update: this.patterns[pattern].update,
      };
    },
    patterns: [{
      // PULSE
      init: function() {
        return;
      },
      update: function() {
        if(!this.inited) {
          this.init();
          this.inited = true;
        }
        if(this.body.speed <= this.minSpeed) {
          force = utils.vectorSetMag(utils.randNum(-1, 1), utils.randNum(-1, 1), this.minSpeed);
          newVelocity = utils.vectorAdd(this.body.velocity.x, this.body.velocity.y, force.x, force.y);
          newVelocity = utils.vectorSetMag(newVelocity.x, newVelocity.y, this.maxSpeed);
          Matter.Body.setVelocity(this.body, newVelocity);
        }
      }
    },
    {
      // OTHER_OBJ
      init: function() {
        this.interval = setInterval(function() {
          speed = utils.getIncreasingExponentialDecay(this.maxSpeed, this.t, utils.constants.RATE, this.minSpeed);
          newVelocity = vectorSetMag(this.body.velocity.x, this.body.velocity.y, speed);
          Matter.Body.setVelocity(this.body, newVelocity);
          this.t++;
        }.bind(this), 1000*utils.constants.SECONDS_PER_INTERVAL);
        Matter.Body.applyForce(this.body, this.body.position, {x:0.005, y:0});
      },
      update: function() {
        if(!this.inited) {
          this.init();
          this.inited = true;
        }
        dir = {
          x: this.args.other.position.x - this.body.position.x,
          y: this.args.other.position.y - this.body.position.y
        };
        if(this.args.avoid && utils.distance(this.args.other.position.x, this.args.other.position.y, this.body.position.x, this.body.position.y) <= this.body.circleRadius*10) {
          dir.x*= -1;
          dir.y*= -1;
        }
        Matter.Body.setVelocity(this.body, utils.vectorSetMag(dir.x, dir.y, this.body.speed));
      }
    },
    {
      // BOUNCE
      init: function() {
        this.speed=this.minSpeed;
        force = utils.vectorSetMag(utils.randNum(-1, 1), utils.randNum(-1, 1), 0.0005);
        Matter.Body.applyForce(this.body, this.body.position, force);

        this.interval = setInterval(function() {
          this.speed = utils.getIncreasingExponentialDecay(this.maxSpeed, this.t, utils.constants.RATE, this.minSpeed);
          this.t++;
        }.bind(this), 1000*utils.constants.SECONDS_PER_INTERVAL);
      },
       update: function() {
         if(!this.inited) {

           this.init();
           this.inited = true;
         }

         this.body.angle=0;
         newVelocity = utils.vectorSetMag(this.body.velocity.x, this.body.velocity.y, this.speed);
         Matter.Body.setVelocity(this.body, newVelocity);
       }
    },
    {
      // PLAYER
      init: function() {
        this.speed=this.minSpeed;
        force = utils.vectorSetMag(utils.randNum(-1, 1), utils.randNum(-1, 1), 0.0005);
        Matter.Body.applyForce(this.body, this.body.position, force);
      },
       update: function() {
         if(!this.inited) {
           this.init();
           this.inited = true;
         }
         this.body.angle=0;
         this.speed = utils.getIncreasingExponentialDecay(this.maxSpeed, this.t, utils.constants.PLAYER_RATE, this.minSpeed);
         newVelocity = utils.vectorSetMag(this.body.velocity.x, this.body.velocity.y, this.speed);
         Matter.Body.setVelocity(this.body, newVelocity);

       }
    }
  ]
  };
})
