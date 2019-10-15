import { Vector } from "./vector.js";
export function getVectorFromTwoPoints(pointA, pointB) {
    return new Vector(pointB.x - pointA.x, pointB.y - pointA.y);
}
export function transformCamelCaseIntoSnakeCase(str) {
    return str.replace(/[a-z]([A-Z])/g, (_, v) => _.slice(0, 1) + '-' + v.toLowerCase()).toLowerCase();
}
export function transformCamelCaseIntoReadable(str) {
    return str.replace(/[a-z]([A-Z])/g, (_, v) => _.slice(0, 1) + ' ' + v.toLowerCase()).toLowerCase();
}
