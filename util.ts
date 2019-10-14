import { Vector } from "./vector.js";

export function getVectorFromTwoPoints(pointA: Vector, pointB: Vector) {
  return new Vector(pointB.x - pointA.x, pointB.y - pointA.y);
}
