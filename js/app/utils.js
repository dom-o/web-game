define ({
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
  applyForceTowardPt: function(x1, y1, x2, y2, mag) {
    x= x1 - x2;
    y= y1 - y2;
    dir= this.vectorNormalize(x,y);
    return {x:dir.x*mag, y:dir.y*mag};
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
