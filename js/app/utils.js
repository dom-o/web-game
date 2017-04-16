define ({
  constants: {
    VERY_SLOW: 0,
    SLOW: 1,
    MEDIUM: 2,
    FAST: 3,
    VERY_FAST: 4,
    PLAYER_SPEED: 5,
    SPEEDS: [
        {minSpeed:1, maxSpeed:2},
        {minSpeed:6, maxSpeed:8},
        {minSpeed:11, maxSpeed:14},
        {minSpeed:16, maxSpeed:20},
        {minSpeed:21, maxSpeed:25},
        {minSpeed:3, maxSpeed:28}
    ],

    PULSE: 0,
    // FOLLOW_PT: 1,
    FOLLOW_OBJ: 1,
    AVOID_OBJ: -1,
    BOUNCE: 2,
    PLAYER_MOVE: 3,

    IGNORE_NODES: 0,
    BOUNCE_NODES: 1,
    BREAK_NODES: 2,

    DEFAULT_COLLISION: 0x0001,
    NODE_COLLISION: 0x0002,

    BOSS_RADIUS: 25,
    BOSS_HEALTH: 100,

    PLAYER_RADIUS:10,
    PLAYER_HEALTH: Infinity,

    SECONDS_PER_INTERVAL: 4,
    RATE: 15,
    PLAYER_RATE: 50,
    DISTANCE_OFFSET: 1.5,

    BOSS_DRAW:0,
    PLAYER_DRAW:1
  },
  randInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
  },
  randNum: function(min, max) {
    return (Math.random() * (max - min)) + min;
  },
  distance: function (x1, y1, x2, y2) {
    dx = x2 - x1;
    dy = y2 - y1;
    return Math.sqrt((dx*dx) + (dy*dy));
  },
  vectorMag: function(x, y) {
    return Math.sqrt((x*x) + (y*y));
  },
  vectorNormalize: function(x, y) {
    m= this.vectorMag(x, y);
    m > 0 ?
      r= {x:x/m, y:y/m}
    :
      r= {x:x, y:y};
    return r;
  },
  vectorAdd: function(x1, y1, x2, y2) {
    return {
      x: (x1+x2),
      y: (y1+y2)
    };
  },
  vectorSetMag: function(x, y, scale) {
    // console.log('vectorSetMag'+x + ', ' + y + ', '+scale);
    v = this.vectorNormalize(x, y);
    return {
      x: v.x * scale,
      y: v.y * scale
    };
  },
  applyForceTowardPt: function(x1, y1, x2, y2, mag) {
    x= x1 - x2;
    y= y1 - y2;
    return this.vectorSetMag(x, y, mag);
  },
  drawByVertices: function(body, ctx) {
    ctx.beginPath();
    vertices = body.vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for(j=0; j<vertices.length; j++) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);

    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  },
  getIncreasingExponentialDecay: function(C, t, rate, base) {
    C= C - base;
    k= -( Math.log( 1-((C-0.0001)/C) ) / rate);
    return C*(1-Math.exp(-k*t)) + base;
  }
});
