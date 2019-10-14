export function distanceOfTwoNodes(nodeA, nodeB) {
  return Math.sqrt(
    Math.pow(nodeA.x - nodeB.x, 2),
    Math.pow(nodeA.y - nodeB.y, 2)
  );
}

import { Vector } from "./vector.js";

export function getVectorFromTwoPoints(pointA, pointB) {
  return new Vector(pointB.x - pointA.x, pointB.y - pointA.y);
}
