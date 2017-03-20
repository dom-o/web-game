// TODO: add functionality such that bouncing off nodewalls/goal makes you go faster and faster so you can hit the goal harder/do more damage. but if you hit environment walls, you lose multiplier/speed.
// TODO: finish dynamicCircleStaticLineCollision method.

define(
['./collisions', './ball', './nodes', './score', './helpText', './utils', 'victor'],
function (collisions, ball, nodes, score, helpText, utils, victor) {
  // window.onload = function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var raf;
    var objs = [];
    debugBool = false;
    debug = {data: null};
    b = ball(300, 100, 1, 0, 100, 7, 7, 'blue', true);
    //g = ball(400, 100, -2, 0, 1, 30, 30, 'green', false);
    objs.push(b);
    // objs.push(g);

    function moveObjWithTempVelocity(obj, tmpVx, tmpVy, tmpS) {
      t1vx = obj.vx;
      t1vy = obj.vy;
      t1s = obj.speed;

      obj.setVelocity(tmpVx, tmpVy);
      obj.speed = tmpS;
      obj.move();

      obj.setVelocity(t1vx, t1vy);
      obj.speed = t1s;
    }

    function draw() {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      score.draw(ctx);
      for(obj in objs) {
        objs[obj].draw(ctx);
      }
      nodes.draw(ctx);
      if(debugBool && debug.data) {
        ctx.fillStyle = 'red';
        ctx.font = "10px arial";
        ctx.textAlign = "center";
        ctx.fillText('a', debug.data.a.x, debug.data.a.y);
        ctx.fillText('b', debug.data.b.x, debug.data.b.y);
        ctx.fillText('c', debug.data.c.x, debug.data.c.y);
        ctx.fillText('d', debug.data.d.x, debug.data.d.y);
        ctx.fillText('p1', debug.data.p1.x, debug.data.p1.y);
        ctx.fillText('p2', debug.data.p2.x, debug.data.p2.y);
        ctx.fillText('ptC', debug.data.ptC.x, debug.data.ptC.y);
        ctx.fillText('circle', debug.data.circle.x, debug.data.circle.y);
        ctx.fillText('cV', debug.data.circle.x+debug.data.circle.vx, debug.data.circle.y+debug.data.circle.vy);

        ctx.beginPath();
        ctx.moveTo(debug.data.a.x, debug.data.a.y);
        ctx.lineTo(debug.data.circle.x, debug.data.circle.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(debug.data.p1.x, debug.data.p1.y);
        ctx.lineTo(debug.data.circle.x, debug.data.circle.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(debug.data.p2.x, debug.data.p2.y);
        ctx.lineTo(debug.data.ptC.x, debug.data.ptC.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(debug.data.circle.x, debug.data.circle.y);
        ctx.lineTo(debug.data.circle.x+debug.data.circle.r, debug.data.circle.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(debug.data.circle.x, debug.data.circle.y);
        ctx.lineTo(debug.data.circle.x+debug.data.circle.vx, debug.data.circle.y+debug.data.circle.vy);
        ctx.stroke();
        ctx.closePath();
      }
    }

    function tick() {
      for(i=0; i<objs.length; i++) {
        obj1 = objs[i];
        obj1.hasMoved = false;
        if(obj1.hitsWalls && nodes.active()) {
          collResult = collisions.dynamicCircleStaticLineCollision(nodes.getBegin().x, nodes.getBegin().y, nodes.getEnd().x, nodes.getEnd().y, obj1.x, obj1.y, obj1.vx, obj1.vy, obj1.radius, obj1.speed, obj1.mass, ctx);

          if(collResult.collide) {
            if(debugBool) {
              debug.data = collResult.debug;
              console.log('debug changed');
              console.log(debug);
            }
            moveObjWithTempVelocity(obj1, collResult.vxT, collResult.vyT, 1);
            obj1.setVelocity(collResult.postColl.vx, collResult.postColl.vy, obj1.speed);
          }
        }
        for(j=i+1; j<objs.length; j++) {
          obj2 = objs[j];
          collResult = collisions.dynamicDynamicCircleCollision(obj1.x, obj1.y, obj2.x, obj2.y, obj1.radius, obj2.radius, obj1.vx, obj1.vy, obj2.vx, obj2.vy);
          if(collResult.collide) {
            moveObjWithTempVelocity(obj1, collResult.c1.vx, collResult.c1.vy, 1);
            moveObjWithTempVelocity(obj2, collResult.c2.vx, collResult.c2.vy, 1);

            // obj2.color = 'red';
            score.num += 1;

            //do something with collision point later
            collisionX = (obj1.x * obj2.radius) +(obj2.x * obj1.radius) / (obj1.radius + obj2.radius);
            collisionY = (obj1.y * obj2.radius) +(obj2.y * obj1.radius) / (obj1.radius + obj2.radius);

            postColl = collisions.getPostCollisionVelocitiesCircleCircle(obj1.x, obj1.y, obj2.x, obj2.y, obj1.vx, obj1.vy, obj2.vx, obj2.vy, obj1.mass, obj2.mass);
            obj1.setVelocity(postColl.b1.vx, postColl.b1.vy);
            obj2.setVelocity(postColl.b2.vx, postColl.b2.vy);
          }
        }
        if (obj1.y + obj1.radius > canvas.height || obj1.y - obj1.radius < 0){
          obj1.setVelocity(obj1.vx, -obj1.vy, obj1.speed);
        }
        if (obj1.x + obj1.radius > canvas.width || obj1.x - obj1.radius < 0){
          obj1.setVelocity(-obj1.vx, obj1.vy, obj1.speed);
        }
        if(!obj1.hasMoved) {
          obj1.move();
        }
      }

      draw();
      if(debugBool) {
          setTimeout(function() {
            // console.log(arguments);
            raf = window.requestAnimationFrame(tick);
          }, 1000, objs);

      }
      else {
        raf = window.requestAnimationFrame(tick);
      }
    }

    document.addEventListener('keydown', function(e) {
      if (/[0-9]/.test(e.key)) {
        nodes.turnOn(e.key);
      }
    });
    document.addEventListener('keyup', function(e) {
      if (/[0-9]/.test(e.key)) {
        nodes.turnOff(e.key);
      }
    });
    document.addEventListener('click', function(e) {
      nodes.addNode(e.clientX, e.clientY);
    });

    draw();
    raf = window.requestAnimationFrame(tick);
  // };
});
