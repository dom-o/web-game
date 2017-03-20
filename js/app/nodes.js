define( {
  placed: function() {
    return this.nodes.length == 10;
  },
  active: function() {
    return this.pair.length == 2 && this.pair[0] != this.pair[1]
  },
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
    }
  },
  turnOff: function(index) {
    if(this.pair.includes(index)) {
      this.pair.splice(this.pair.indexOf(index), 1);
    }
  },
  addNode: function(x, y) {
    if(!this.placed()) {
      this.nodes.push({x:x, y:y});
    }
  },
  draw: function(ctx) {
    for (node in this.nodes){
      ctx.beginPath();
      ctx.arc(this.nodes[node].x, this.nodes[node].y, this.radius, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.fillStyle = this.text_color;
      ctx.font = "10px arial";
      ctx.textAlign = "center";
      ctx.fillText(node, this.nodes[node].x, this.nodes[node].y+3);
    }
    if(this.active()) {
      this.drawWall(ctx);
    }
  },
  drawWall: function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.nodes[this.pair[0]].x, this.nodes[this.pair[0]].y);
    ctx.lineTo(this.nodes[this.pair[1]].x, this.nodes[this.pair[1]].y);
    ctx.stroke();
    ctx.closePath();
  }
});
