define([
  'matter', './nodes', './ball', './utils', './boss', './movementPatterns'
], function(Matter, nodes, ball, utils, boss, movementPatterns) {
// TODO: add collision filter so boxB doesn't hit walls
// TODO: add health/score calc to game
// TODO: add a couple different movement patterns to boxB
// TODO: add collision particle effects from hackphysics article


canvas = document.getElementById('canvas');
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
score = 0;
scoreIncrease = 5;
scoreC=100, scoreBase=1, scoreT=0, scoreRate=160;
mult = utils.getIncreasingExponentialDecay(scoreC, scoreT, scoreBase, scoreRate);
importantBodies = [];

window.onresize = function(e) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

  // module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Render = Matter.Render,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();
engine.world.gravity.x = 0;
engine.world.gravity.y = 0;

var boxA = boss(35, 60, 10, 100, movementPatterns.bounce);
// var boxB = boss(450, 100, 25, 100, movementPatterns.pulse);
// var boxC = boss(100, 100, 50, 100, movementPatterns.followPoint, ctx);
// var boxB = boss(100, 100, 5, 100, movementPatterns.followObj);
var boxB = boss(35, 60, 5, 100, movementPatterns.avoidObj);

boxA.movementPattern.init(boxA.body, 2, 30, 80);
// boxB.movementPattern.init(boxB.body, 5);
// boxC.movementPattern.init(boxC.body, canvas.width, canvas.height, 30);
// boxB.movementPattern.init(boxB.body, boxA.body, 5);
boxB.movementPattern.init(boxB.body, boxA.body, engine.world);

boxA.body.collisionFilter.mask = 0x0001 | nodes.nodeCategory;
boxB.body.collisionFilter.mask = 0x0001;

offset=5;
ground = [
  Bodies.rectangle(canvas.width/2, -offset, canvas.width+2*offset, 50, { isStatic: true, friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1 }),
  Bodies.rectangle(-offset, canvas.height/2, 50, canvas.height+2*offset, { friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1, isStatic: true }),
  Bodies.rectangle(canvas.width/2, canvas.height+offset, canvas.width+2*offset, 50, { friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1, isStatic: true }),
  Bodies.rectangle(canvas.width+offset, canvas.height/2, 50, canvas.height+2*offset, { friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1, isStatic: true })
];

// add all of the bodies to the world
World.add(engine.world, ground);
World.add(engine.world, [boxA.body, boxB.body]);//, boxC.body, boxD.body, boxE.body]);
importantBodies.push(boxA.body);
importantBodies.push(boxB.body);

mouseConstraint = MouseConstraint.create(engine, {element: canvas});

Events.on(mouseConstraint, 'mouseup', function(event) {
  mousePosition = event.mouse.position;
  newNode = nodes.addNode(mousePosition.x, mousePosition.y);
  if(newNode) {
    World.add(engine.world, newNode);
    importantBodies.push(newNode);
  }
});

Events.on(engine, 'collisionEnd', function(event) {
  pairs = event.pairs;
  for(i=0; i<pairs.length; i++) {
    pair = [pairs[i].bodyA, pairs[i].bodyB];
    if(pair.includes(boxA.body)) {
      boxA.movementPattern.colls++;
      scoreT++;
      mult= utils.getIncreasingExponentialDecay(scoreC, scoreT, scoreRate, scoreBase);

      if(pair.includes(nodes.getBegin()) || pair.includes(nodes.getEnd())) {
      }
      else if(pair.includes(nodes.wall)) {
      }
      else if (ground.includes(pair[0]) || ground.includes(pair[1])) {
        boxA.movementPattern.colls = 0;
        scoreT=0;
      }
      else if(pair.includes(boxB.body)) {
        score += mult * scoreIncrease;
        score= Math.round(score);
      }
    }
  }
});

// run the engine
Engine.run(engine);

(
  function render() {
    boxA.movementPattern.update();
    boxB.movementPattern.update();
    // boxC.movementPattern.update();
    // boxD.movementPattern.update();
    // boxE.movementPattern.update();

    bodies = Composite.allBodies(engine.world);

    window.requestAnimationFrame(render);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "75px arial";
    ctx.textAlign = "center";
    ctx.fillText(score, canvas.width/2, canvas.height/2);

    boxA.draw(ctx);
    boxB.draw(ctx);
    nodes.draw(ctx);

    for(i=0; i<bodies.length; i++) {
      body = bodies[i];
      if(!importantBodies.includes(body)) {
        utils.drawByVertices(body, ctx);
      }
    }
})();

document.addEventListener('keydown', function(e) {
  if (/[0-9]/.test(e.key)) {
    wall = nodes.turnOn(e.key);
    if(wall && !Composite.allBodies(engine.world).includes(wall)) {
      World.add(engine.world, wall);
      importantBodies.push(wall);
    }
  }
});
document.addEventListener('keyup', function(e) {
  if (/[0-9]/.test(e.key)) {
    wall = nodes.turnOff(e.key);
    if(wall) {
      World.remove(engine.world, wall);
      importantBodies.splice(importantBodies.indexOf(wall), 1);
    }
  }
});
});
