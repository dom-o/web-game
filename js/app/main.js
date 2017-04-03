define([
  'matter', './nodes', './ball', './utils'
], function(Matter, nodes, ball, utils) {

canvas = document.getElementById('canvas');
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

// // create a renderer
// var render = Render.create({
//     element: canvas,
//     engine: engine
// });

var boxA = ball(35, 60, 10);
var boxB = ball(450, 100, 10);
offset=5;
ground = [
  Bodies.rectangle(canvas.width/2, -offset, canvas.width+2*offset, 50, { isStatic: true, friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1 }),
  Bodies.rectangle(-offset, canvas.height/2, 50, canvas.height+2*offset, { friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1, isStatic: true }),
  Bodies.rectangle(canvas.width/2, canvas.height+offset, canvas.width+2*offset, 50, { friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1, isStatic: true }),
  Bodies.rectangle(canvas.width+offset, canvas.height/2, 50, canvas.height+2*offset, { friction: 0, frictionAir: 0, frictionStatic: 0, restitution: 1, isStatic: true })
];

// add all of the bodies to the world
World.add(engine.world, ground)
World.add(engine.world, [boxA.body]);//, boxB.body]);

mouseConstraint = MouseConstraint.create(engine, {element: canvas});

Events.on(mouseConstraint, 'mouseup', function(event) {
  mousePosition = event.mouse.position;
  newNode = nodes.addNode(mousePosition.x, mousePosition.y);
  if(newNode) {
    World.add(engine.world, newNode);
  }
});

Events.on(engine, 'collisionStart', function(event) {
  pairs = event.pairs;
  for(i=0; i<pairs.length; i++) {
    pair = [pairs[i].bodyA, pairs[i].bodyB];
    if(pair.includes(boxA.body)) {
      if(pair.includes(nodes.getBegin()) || pair.includes(nodes.getEnd())) {
        console.log('collisions with node');
        boxA.colls++;
      }
      else if(pair.includes(nodes.wall)) {
        console.log("collision with wall");
        boxA.colls++;
      }
      else if (ground.includes(pair[0]) || ground.includes(pair[1])) {
        boxA.colls = 0;
      }
      else if(pair.includes(boxB.body)) {
        console.log('collision with ball');
        boxA.colls++;
      }
    }
  }
});

// run the engine
Engine.run(engine);

(
  function render() {
    boxA.updateVelocity();
    Body.setAngle(boxA.body, 0);
    bodies = Composite.allBodies(engine.world);

    window.requestAnimationFrame(render);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(i=0; i<bodies.length; i++) {
      body = bodies[i];
      nodes.draw(ctx);
      boxA.draw(ctx);
      if(
        body !== boxA.body &&
        // body !== boxB.body &&
        !nodes.nodes.includes(body) &&
        body !== nodes.wall
      ) {
        utils.drawByVertices(body, ctx);
      }
    }
})();

document.addEventListener('keydown', function(e) {
  if (/[0-9]/.test(e.key)) {
    wall = nodes.turnOn(e.key);
    if(wall && !Composite.allBodies(engine.world).includes(wall)) {
      World.add(engine.world, wall);
    }
  }
});
document.addEventListener('keyup', function(e) {
  if (/[0-9]/.test(e.key)) {
    wall = nodes.turnOff(e.key);
    if(wall) {
      World.remove(engine.world, wall);
    }
  }
});

Body.applyForce(boxA.body, boxA.body.position, {x:0.000001, y:0.000002});
});
