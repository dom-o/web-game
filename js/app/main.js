define([
  'matter', './nodes', './ball'
], function(Matter, nodes, ball) {

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
World.add(engine.world, [boxA.body, boxB.body]);

mouseConstraint = MouseConstraint.create(engine, {element: canvas});

Events.on(mouseConstraint, 'mouseup', function(event) {
  mousePosition = event.mouse.position;
  newNode = nodes.addNode(mousePosition.x, mousePosition.y);
  if(newNode) {
    World.add(engine.world, newNode);
  }
});

Events.on(engine, 'collisionEnd', function(event) {
  pairs = event.pairs;
  for(i=0; i<pairs.length; i++) {
    pair = [pairs[i].bodyA, pairs[i].bodyB];
    if((pair.includes(nodes.getBegin()) || pair.includes(nodes.getEnd())) && pair.includes(boxA.body)) {
      console.log('collisions with node');
      boxA.colls++;
      boxA.updateVelocity();
    }
    else if(pair.includes(wall) && pair.includes(boxA.body)) {
      console.log("collision with wall");
      boxA.colls++;
      boxA.updateVelocity();
    }
    else if (pair.includes(boxA.body) && (ground.includes(pair[0]) || ground.includes(pair[1]))) {
      console.log('collision with bounds');
      boxA.colls = 0;
      boxA.updateVelocity();

    }
    else if(pair.includes(boxA.body) && pair.includes(boxB.body)) {
      console.log('collision with ball');
      boxA.colls++;
      boxA.updateVelocity();
    }
  }
});

// run the engine
Engine.run(engine);

(
  function render() {
    bodies = Composite.allBodies(engine.world);

    window.requestAnimationFrame(render);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    for(i=0; i<bodies.length; i++) {
      vertices = bodies[i].vertices;
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for(j=0; j<vertices.length; j++) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
      }
      ctx.lineTo(vertices[0].x, vertices[0].y);
    }
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fill();
})();
wall = null;
wallPlaced = false;
document.addEventListener('keydown', function(e) {
  if (/[0-9]/.test(e.key)) {
    nodes.turnOn(e.key);
    if(nodes.wallActive() && !wallPlaced) {
      wall= nodes.getWall();
      World.add(engine.world, wall);
      wallPlaced = true;
    }
  }
});
document.addEventListener('keyup', function(e) {
  if (/[0-9]/.test(e.key)) {
    nodes.turnOff(e.key);
    if(!nodes.wallActive() && wallPlaced) {
      World.remove(engine.world, wall);
      wall = null;
      wallPlaced = false;
    }
  }
});
Body.applyForce(boxA.body, boxA.body.position, boxA.genForce());
});
