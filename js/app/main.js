define([
  'matter', './nodes', './ball', './utils', './boss', './movementPatterns', './boxGen', './draw'
], function(Matter, nodes, ball, utils, boss, movementPatterns, boxGen, draw) {
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
    Composite = Matter.Composite
    constants = utils.constants;

// create an engine
var engine = Engine.create();
engine.world.gravity.x = 0;
engine.world.gravity.y = 0;
var boxA = boxGen.genPlayer(canvas.width, canvas.height);
var boxB = boxGen.genBoss(boxA.body, canvas.width, canvas.height, constants.BOUNCE, constants.SLOW, constants.IGNORE_NODES, constants.BOSS_RADIUS, constants.BOSS_HEALTH, constants.BOSS_DRAW);

offset=25;
ground = [
  Bodies.rectangle(canvas.width/2, -offset, canvas.width+2*offset, 50, { isStatic: true, friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1 }),
  Bodies.rectangle(-offset, canvas.height/2, 50, canvas.height+2*offset, { friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1, isStatic: true }),
  Bodies.rectangle(canvas.width/2, canvas.height+offset, canvas.width+2*offset, 50, { friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1, isStatic: true }),
  Bodies.rectangle(canvas.width+offset, canvas.height/2, 50, canvas.height+2*offset, { friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1, isStatic: true })
];

// add all of the bodies to the world
World.add(engine.world, ground);
World.add(engine.world, [boxA.body, boxB.body]);
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
      boxA.movementPattern.t++;
      scoreT++;
      mult= utils.getIncreasingExponentialDecay(scoreC, scoreT, scoreRate, scoreBase);

      if(pair.includes(nodes.getBegin()) || pair.includes(nodes.getEnd())) {
      }
      else if(pair.includes(nodes.wall)) {
      }
      else if (ground.includes(pair[0]) || ground.includes(pair[1])) {
        boxA.movementPattern.t = 0;
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
