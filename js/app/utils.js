define ({
  randInt: function (max, min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    num = Math.floor(Math.random() * (max - min)) + min;
    return num;
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
  }
});
