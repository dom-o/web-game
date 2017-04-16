define(['./utils', 'matter', './boss', './movementPatterns'], function(utils, Matter, boss, movementPatterns){
  return {
    genBoss: function(player, worldWidth, worldHeight, movement, speed, nodeReaction, size, health, draw) {
      constants= utils.constants;
      args={};
      switch(movement) {
        case constants.PULSE:
          args= {};
        break;
        case constants.FOLLOW_OBJ:
          args= {
            avoid: false,
            other: player
          };
        break;
        case constants.AVOID_OBJ:
          args= {
            avoid: true,
            other: player
          };
        break;
        case constants.FOLLOW_PT:
          args= {
            width: worldWidth,
            height: worldHeight
          };
        break;
        case constants.BOUNCE:
          args= {};
        break;
        case constants.PLAYER:
          args= {};
        break;
      }
      movement = Math.abs(movement);

      genBoss= boss(
        utils.randInt(0+size, worldWidth-size),
        utils.randInt(0+size, worldHeight-size),
        size, health, draw);
      bossMove= movementPatterns.pattern(genBoss.body, constants.SPEEDS[speed].minSpeed, constants.SPEEDS[speed].maxSpeed, movement, args);
      genBoss.movementPattern = bossMove;

      switch(nodeReaction) {
        case constants.IGNORE_NODES:
          genBoss.body.collisionFilter.mask = constants.DEFAULT_COLLISION;
        break;
        case constants.BREAK_NODES:
          genBoss.body.collisionFilter.mask = constants.DEFAULT_COLLISION | constants.NODE_COLLISION;
          genBoss.breaksNodes=true;
        break;
        case constants.BOUNCE_NODES:
          genBoss.body.collisionFilter.mask = constants.DEFAULT_COLLISION | constants.NODE_COLLISION;
        break;
      }

      return genBoss;
  },
  genPlayer: function(worldWidth, worldHeight) {
    constants = utils.constants;
    player = boss(
      utils.randInt(0+constants.PLAYER_RADIUS, worldWidth-constants.PLAYER_RADIUS),
      utils.randInt(0+constants.PLAYER_RADIUS, worldHeight-constants.PLAYER_RADIUS),
      constants.PLAYER_RADIUS, constants.PLAYER_HEALTH, constants.PLAYER_DRAW);
    move= movementPatterns.pattern(player.body, constants.SPEEDS[constants.PLAYER_SPEED].minSpeed, constants.SPEEDS[constants.PLAYER_SPEED].maxSpeed, constants.PLAYER_MOVE, {});
    player.movementPattern = move;
    player.body.collisionFilter.mask = constants.DEFAULT_COLLISION | constants.NODE_COLLISION;
    return player;
  }
}
})
