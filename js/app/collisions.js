define(['victor', './utils'], function(victor, utils) {
  return {
    lineLineCollision: function(x1, y1, x2, y2, x3, y3, x4, y4) {
      //based on code from http://www.jeffreythompson.org/collision-detection/line-line.php
      uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
      uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

      if(uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        intersectionX = x1 + (uA * (x2-x1));
        intersectionY = y1 + (uA * (y2-y1));
        return {collide: true, x: intersectionX, y: intersectionY};
      }
      return {collide: false, x: -1, y: -1};
    },
    pointCircleCollision: function (px, py, cx, cy, cr) {
      return this.distance(px, py, cx,cy) <= cr;
    },
    pointLineCollision: function (x1, y1, x2, y2, px, py) {
      dist1 = this.distance(px, py, x1, y1);
      dist2 = this.distance(px, py, x2, y2);
      lineLen = this.distance(x2, y2, x1, y1);
      buff = 0.1;

      if(dist1+dist2 >= lineLen-buff && dist1+dist2 <= lineLen +buff) {
        return true;
      }
      return false;
    },
    closestPointOnLineToPoint: function(x1L, y1L, x2L, y2L, x, y) {
      // based off code from http://ericleong.me/research/line-line/
      a1 = y2L - y1L;
      b1 = x1L - x2L;
      c1 = (a1*x1L) + (b1*y1L);
      c2 = (-b1*x) + (a1*y);
      det = (a1*a1) - (-b1 * b1);
      cx = (a1*c1 - b1*c2)/det;
      cy = (a1*c2 - -b1*c1)/det;
      det != 0 ? pt= {x:cx, y:cy} : pt= {x:x, y:y};
      return pt;
    },
    extendLinePastEndpt: function(x1L, y1L, x2L, y2L, d) {
      l = new victor(x2L - x1L, y2L - y1L);
      l = l.normalize();
      return {x: x2L + l.x*d, y: y2L + l.y*d};
    },
    dynamicCircleStaticLineCollision: function(x1L, y1L, x2L, y2L, cx, cy, cvx, cvy, cr, cs) {
      // based off code from http://ericleong.me/research/line-line/

      trueVx = cvx * cs;
      trueVy = cvy * cs;

      a= this.lineLineCollision(x1L, y1L, x2L, y2L, cx, cy, cx+trueVx, cy+trueVy);

      b= this.closestPointOnLineToPoint(x1L, y1L, x2L, y2L, cx+trueVx, cy+trueVy);
      bCollide = this.distance(b.x, b.y, cx+trueVx, cy+trueVy) <= cr && this.pointLineCollision(x1L, y1L, x2L, y2L, b.x, b.y);

      c= this.closestPointOnLineToPoint(cx, cy, cx+trueVx, cy+trueVy, x1L, y1L);
      cCollide = this.distance(c.x, c.y, x1L, y1L) <= cr && this.pointLineCollision(cx, cy, cx+trueVx, cy+trueVy, c.x, c.y);

      d= this.closestPointOnLineToPoint(cx, cy, cx+trueVx, cy+trueVy, x2L, y2L);
      dCollide = this.distance(d.x, d.y, x2L, y2L) <= cr &&  this.pointLineCollision(cx, cy, cx+trueVx, cy+trueVy, d.x, d.y);

      if(a.collide || bCollide || cCollide || dCollide) {
        if(!a.collide) {
          moveVEnd = this.extendLinePastEndpt(cx, cy, cx+trueVx, cy+trueVy, cr);
          a=this.lineLineCollision(x1L, y1L, x2L, y2L, cx, cy, moveVEnd.x, moveVEnd.y);
        }
        aC = new victor(cx -a.x, cy-a.y);
        p1 = this.closestPointOnLineToPoint(x1L, y1L, x2L, y2L, cx, cy);
        p1C = new victor(cx-p1.x, cy-p1.y);
        cV = new victor(trueVx, trueVy);

        p2= {
          x: a.x - cr * aC.length() / p1C.length() * cV.normalize().x,
          y: a.y - cr * aC.length() / p1C.length() * cV.normalize().y
        };

        ptC = this.closestPointOnLineToPoint(x1L, y1L, x2L, y2L, p2.x, p2.y);
        if(this.pointLineCollision(x1L, y1L, x2L, y2L, ptC.x, ptC.y)) {
          //has collided with line
          normal = new victor(ptC.x-p2.x, ptC.y-p2.y).normalize();
          cV = new victor(cvx, cvy);

          dotProd = normal.dot(cV);

          postColl = {
            vx: cV.x - 2 * dotProd * normal.x,
            vy: cV.y - 2 * dotProd * normal.y
          };

          debug = {
            p1: p1,
            p2: p2,
            ptC: ptC,
            a: {x:a.x, y:a.y},
            b:b,
            c:c,
            d:d,
            circle: {x:cx, y:cy, vx:cvx*cs, vy:cvy*cs, r:cr}
          };
          return {collide: true, vxT:p2.x-cx, vyT:p2.y-cy, postColl: postColl, debug: debug};
        }
        else {
          // this.distance(p2.x, p2.y, x1L, y1L) < this.distance(p2.x, p2.y, x2L, y2L) ?
          //   pt= {x:x1L, y:y1L}
          //   :
          //   pt= {y:x2L, x:y2L};
          //
          // v = new victor(cvx/r, cvy/r).normalize();
          // //has collided w/endpt
          // return {collide: true, vxT:p2.x-cx, vyT:p2.y-cy, postColl: {vx: v.x, vy: v.y}};
          return {collide: false, vxT:cvx, vyT:cvx, postColl: {}};
        }
      }
      return {collide: false, vxT:cvx, vyT:cvx, postColl: {}};
    },
    dynamicDynamicCircleCollision: function(c1x, c1y, c2x, c2y, c1r, c2r, c1vx, c1vy, c1s, c1m, c2vx, c2vy, c2s, c2m) {
      // based off of code from http://www.gamasutra.com/view/feature/131424/pool_hall_lessons_fast_accurate_.php
      c1v = new victor(c1vx*c1s, c1vy*c1s);
      c2v = new victor(c2vx*c2s, c2vy*c2s);

      relV = c1v.subtract(c2v);
      collResult = this.dynamicStaticCircleCollision(c1x, c1y, c2x, c2y, c1r, c2r, c1vx, c1vy, c1s);
      if(collResult.collide) {
        coll = new victor(collResult.x, collResult.y);
        mult = coll.length() / relV.length();
        postColl = this.getPostCollisionVelocitiesCircleCircle(c1x, c1y, c2x, c2y, c1vx, c1vy, c2vx, c2vy, c1m, c2m, c1s, c2s);
        return {
          collide: true,
          c1: {vx:c1v.x*mult, vy:c1v.y*mult},
          c2: {vx:c2v.x*mult, vy:c2v.y*mult},
          postColl: postColl
        };
      }
      else {
        return {
          collide: false,
          c1: {vx:c1vx, vy:c1vy},
          c2: {vx:c2vx, vy:c2vy},
          postColl: {}
        };
      }
    },
    dynamicStaticCircleCollision: function (c1x, c1y, c2x, c2y, c1r, c2r, c1vx, c1vy, c1s, c1m) {
      // based off of code from http://www.gamasutra.com/view/feature/131424/pool_hall_lessons_fast_accurate_.php
      c1v = new victor(c1vx*c1s, c1vy*c1s);
      c1Pos = new victor(c1x, c1y);
      c2Pos = new victor(c2x, c2y);
      dist = this.distance(c1x, c1y, c2x, c2y) - (c1r+c2r);

      if(c1v.magnitude() < dist) {
        return {collide:false, vx:c1v.x, vy:c1v.y, postColl: {}};
      }

      n = new victor().copy(c1v);
      n = n.normalize();
      c = c2Pos.subtract(c1Pos);
      d = n.dot(c);
      if(d <= 0) {
        return {collide:false, vx:c1v.x, vy:c1v.y, postColl: {}};
      }

      cLen = c.magnitude();
      f = (cLen *cLen) - (d*d);
      sumRadiiSquared = (c1r+c2r) * (c1r+c2r);
      if(f >= sumRadiiSquared) {
        return {collide:false, vx:c1v.x, vy:c1v.y, postColl: {}};
      }

      t = sumRadiiSquared - f;
      if(t < 0) {
        return {collide:false, vx:c1v.x, vy:c1v.y, postColl: {}};
      }

      distToTravel = d - Math.sqrt(t);
      mag = c1v.magnitude();
      if(mag < distToTravel) {
        return {collide:false, vx:c1v.x, vy:c1v.y, postColl: {}};
      }

      c1v = c1v.normalize();
      c1v.x *= distToTravel;
      c1v.y *= distToTravel;

      postColl = this.getPostCollisionVelocitiesCircleCircle(c1x, c1y, c2x, c2y, c1vx, c1vy, 0, 0, c1m, 0, c1s, 0);
      return {collide:true, vxT:c1v.x, vyT:c1v.y, postColl: postColl.c1};
    },
    getPostCollisionVelocitiesCircleCircle(c1x, c1y, c2x, c2y, c1vx, c1vy, c2vx, c2vy, c1m, c2m, c1s, c2s) {
      b = new victor(c1x, c1y);
      g = new victor(c2x, c2y);
      v1 = new victor(c1vx*c1s, c1vy*c1s);
      v2 = new victor(c2vx*c2s, c2vy*c2s);
      n= b.subtract(g).normalize();
      dot1 = v1.dot(n);
      dot2 = v2.dot(n);

      oP = (2 * (dot1 - dot2)) / (c1m + c2m);

      x1 = v1.x - oP * c2m * n.x;
      y1 = v1.x - oP * c2m * n.y;

      x2 = v2.x + oP * c1m * n.x;
      y2 = v2.x + oP * c1m * n.y;

      return {c1: {vx:x1, vy:y1}, c2:{vx:x2, vy:y2}};
    },
  }
});
