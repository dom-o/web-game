define(['./utils', 'matter'], function(utils, Matter){
  return {
    pulse: {
      interval: -1,
      stillPulsing: true,
      maxSpeed: -1,
      body:null,
      init: function(body, maxSpeed) {
        this.maxSpeed=maxSpeed;
        this.body=body;

        this.interval = setInterval(function() {
          x= utils.randNum(-1, 1);
          y= utils.randNum(-1, 1);
          force = utils.vectorNormalize(x, y);
          // this.body.speed===0 ? mag = 0.005 : mag= 0.005 * this.body.speed;
          mag= 0.01;
          Matter.Body.applyForce(this.body, this.body.position, {x:force.x*mag, y:force.y*mag});
        }.bind(this),
        1000*3);
      },
      update: function() {
        if(this.body.speed > this.maxSpeed) {
          direction = utils.vectorNormalize(this.body.velocity.x, this.body.velocity.y);
          newVelocity = {
            x: direction.x*this.maxSpeed,
            y: direction.y*this.maxSpeed
          };
          Matter.Body.setVelocity(this.body, newVelocity);
        }

        if(!this.stillPulsing) {
          clearInterval(this.interval);
        }
      }
    },

    followPoint: {
      pt: {
        x:-1,
        y:-1,
      },
      body: null,
      width: -1,
      height: -1,
      maxSpeed: -1,
      offset: 1.5,
      mag: 0.01,
      init: function(body, width, height, maxSpeed) {
        this.body=body;
        this.width=width;
        this.height=height;
        this.maxSpeed = maxSpeed;
        this.pt = {
          x: utils.randInt(0, width),
          y: utils.randInt(0, height)
        };
      },
      update: function() {
        if(utils.distance(this.body.position.x, this.body.position.y, this.pt.x, this.pt.y) <= this.body.circleRadius*offset) {
          this.pt = {
            x: utils.randInt(0, this.width),
            y: utils.randInt(0, this.height)
          };
          force = utils.applyForceTowardPt(this.pt.x, this.pt.y, this.body.position.x, this.body.position.y, this.mag);
          Matter.Body.applyForce(this.body, this.body.position, force);
        }
        else if(this.body.speed < this.maxSpeed) {
          force = utils.applyForceTowardPt(this.pt.x, this.pt.y, this.body.position.x, this.body.position.y, this.mag);
          Matter.Body.applyForce(this.body, this.body.position, force);
        }
      }
    },


    followObj: {
      body: null,
      toFollow: null,
      mag: 0.001,
      maxSpeed: -1,
      stillMoving: true,
      interval: -1,
      init: function(body, toFollow, maxSpeed) {
        this.body = body;
        this.toFollow = toFollow;
        this.maxSpeed = maxSpeed;
        this.interval = setInterval(function() {
          force = utils.applyForceTowardPt(this.toFollow.position.x, this.toFollow.position.y, this.body.position.x, this.body.position.y, this.mag);
          Matter.Body.applyForce(this.body, this.body.position, force);

        }.bind(this), 1000*2);
      },
      update: function() {
        if(this.body.speed > this.maxSpeed) {
          direction = utils.vectorNormalize(this.body.velocity.x, this.body.velocity.y);
          newVelocity = {
            x: direction.x*this.maxSpeed,
            y: direction.y*this.maxSpeed
          };
          Matter.Body.setVelocity(this.body, newVelocity);
        }
        if(!this.stillMoving) {
          clearInterval(this.interval);
        }
      }
    },

    avoidObj: {
      body: null,
      toAvoid: null,
      mag: 0.005,
      maxSpeed: -1,
      stillMoving: true,
      interval: -1,
      init: function(body, toAvoid, maxSpeed) {
        this.body = body;
        this.toAvoid = toAvoid;
        this.maxSpeed = maxSpeed;
        this.interval = setInterval(function() {
          force = utils.applyForceTowardPt(this.body.position.x, this.body.position.y, this.toAvoid.position.x, this.toAvoid.position.y, this.mag);
          Matter.Body.applyForce(this.body, this.body.position, force);

        }.bind(this), 1000*2);
      },
      update: function() {
        if(this.body.speed > this.maxSpeed) {
          direction = utils.vectorNormalize(this.body.velocity.x, this.body.velocity.y);
          newVelocity = {
            x: direction.x*this.maxSpeed,
            y: direction.y*this.maxSpeed
          };
          Matter.Body.setVelocity(this.body, newVelocity);
        }
        if(!this.stillMoving) {
          clearInterval(this.interval);
        }
      }
    },

    bounce: {
      maxSpeed: -1,
      minSpeed: -1,
      colls: 0,
      rate: -1,
      body: null,
      init: function(body, minSpeed, maxSpeed, rate) {
        this.body=body;
        this.minSpeed=minSpeed;
        this.maxSpeed=maxSpeed;
        this.rate=rate;
      },
       update: function() {
         if(this.body.speed===0) {
           x= utils.randNum(-1, 1);
           y= utils.randNum(-1, 1);
           force = utils.vectorNormalize(x, y);
           mag=0.0005;
           Matter.Body.applyForce(this.body, this.body.position, {x:force.x*mag, y:force.y*mag});
         }
         direction = utils.vectorNormalize(this.body.velocity.x, this.body.velocity.y);
         speed = utils.getIncreasingExponentialDecay(this.maxSpeed, this.colls, this.rate, this.minSpeed);
         newVelocity = {
           x: direction.x*speed,
           y: direction.y*speed
         };
         Matter.Body.setVelocity(this.body, newVelocity);
       }
    }
  };
})
