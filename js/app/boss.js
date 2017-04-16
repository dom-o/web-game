define(['./utils', 'matter', './draw'], function(utils, Matter, draw){
  return function (x, y, radius, maxHealth, drawStyle) {
    return {
      radius: radius,
      maxHealth: maxHealth,
      health: maxHealth,
      breaksNodes: false,
      movementPattern: null,
      body: Matter.Bodies.circle(x, y, radius, {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        restitution: 1,
        inertia: Infinity
      }),
      draw: draw.styles[drawStyle]
    }
  };
});
