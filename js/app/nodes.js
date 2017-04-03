define(['matter', './utils'], function(Matter, utils) {
  return {
    placed: function() {
      return this.nodes.length == 10;
    },
    wallActive: function() {
      return this.pair.length == 2 && this.pair[0] != this.pair[1]
    },
    nodeActive: function() {
      return this.pair.length == 1 || this.wallActive();
    },
    wall:null,
    nodes:[
    ],
    pair:[],
    radius: 7,
    color: 'black',
    text_color: "white",
    getBegin: function () {
      return this.nodes[this.pair[0]];
    },
    getEnd: function() {
      return this.nodes[this.pair[1]];
    },
    turnOn: function(index) {
      if(!this.pair.includes(index) && this.pair.length < 2 && index < this.nodes.length) {
        this.pair.push(index);
        if(this.wallActive()) {
          this.wall = this.genWall();
        }
        return this.wall;
      }
    },
    turnOff: function(index) {
      if(this.pair.includes(index)) {
        this.pair.splice(this.pair.indexOf(index), 1);
        tmpwall = this.wall;
        if(!this.wallActive()) {
          this.wall = null;
        }
        return tmpwall;
      }
    },
    addNode: function(x, y) {
      if(!this.placed()) {
        node = Matter.Bodies.circle(x, y, this.radius, {isStatic: true});
        this.nodes.push(node);
        return node;
      }
      return null;
    },
    genWall: function() {
      pts = [];
      if(this.wallActive()) {
        dx= this.getEnd().position.x - this.getBegin().position.x;
        dy= this.getEnd().position.y - this.getBegin().position.y;

        v = utils.vectorNormalize(-dy, dx);
        pts.push({
          x: this.getEnd().position.x + this.radius*v.x,
          y: this.getEnd().position.y + this.radius*v.y
        });
        pts.push({
          x: this.getEnd().position.x - this.radius*v.x,
          y: this.getEnd().position.y - this.radius*v.y
        });

        pts.push({
          x: this.getBegin().position.x - this.radius*v.x,
          y: this.getBegin().position.y - this.radius*v.y
        });
        pts.push({
          x: this.getBegin().position.x + this.radius*v.x,
          y: this.getBegin().position.y + this.radius*v.y
        });
        wall = Matter.Body.create({
          position: Matter.Vertices.centre(pts),
          vertices: pts,
          isStatic: true,
          friction: 0,
          frictionAir: 0,
          frictionStatic: 0,
          restitution: 1
        });
        return wall;
      }
      return null;
    },
    draw: function(ctx) {
      if(this.wallActive()) {
        this.drawWall(ctx);
      }
      for (node in this.nodes){
        tmpFill = ctx.fillStyle;
        ctx.fillStyle = this.color;
        utils.drawByVertices(this.nodes[node], ctx);

        ctx.fillStyle = this.text_color;
        ctx.font = "10px arial";
        ctx.textAlign = "center";
        ctx.fillText(node, this.nodes[node].position.x, this.nodes[node].position.y+3);

        ctx.fillStyle = tmpFill;
      }
    },
    drawWall: function(ctx) {
      tmpFill = ctx.fillStyle;
      ctx.fillStyle = this.color;
      utils.drawByVertices(this.wall, ctx);
      ctx.fillStyle = tmpFill;
    }
  }
});
