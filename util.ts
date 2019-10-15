import { Vector } from "./vector.js";

export function getVectorFromTwoPoints(pointA: Vector, pointB: Vector) {
  return new Vector(pointB.x - pointA.x, pointB.y - pointA.y);
}

export function transformCamelCaseIntoSnakeCase(str: string) {
  return str.replace(/[a-z]([A-Z])/g, (_, v) => _.slice(0, 1) + '-' + v.toLowerCase()).toLowerCase();
}

export function transformCamelCaseIntoReadable(str: string) {
  return str.replace(/[a-z]([A-Z])/g, (_, v) => _.slice(0, 1) + ' ' + v.toLowerCase()).toLowerCase();
}

