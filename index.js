import { Vector } from "./vector.js";
import { GravityNode } from "./gravity-node.js";
import {
  distanceOfTwoNodes,
  getVectorFromTwoPoints
} from "./util.js";

function calculateGravitationalForce(nodeA, nodeB) {
  const G = 6.67430 ** -11;
  return G * nodeA.mass * nodeB.mass / distanceOfTwoNodes(nodeA, nodeB) ** 2
}

function applyForceOntoTwoNodes(nodeA, nodeB, timeDiffMilli) {
  const force = calculateGravitationalForce(nodeA, nodeB);

  const aToB = getVectorFromTwoPoints(nodeA, nodeB);

  const newAPosition = aToB
    .unitVector()
    .multiplyByN(force)
    .addVector(nodeA);

  const newBPosition = aToB
    .flip()
    .unitVector()
    .multiplyByN(force)
    .addVector(nodeA);

  nodeA.x = newAPosition.x;
  nodeA.y = newAPosition.y;

  nodeB.x = newBPosition.x;
  nodeB.y = newBPosition.y;
}

function asymptoticalReachOne(v) {
  if (!Number.isFinite(v) || v < 0)
    throw new Error('The given value needs to a number equal or greater than zero but was ' + v + ' (' + typeof v + ')');
  return 1 - 1 / (v + 1);
}

function applyGravityNodeOnSVGCircleNode(gn, circle) {
  circle.setAttribute('r', gn.radius);

  circle.setAttribute('cx', gn.x);
  circle.setAttribute('cy', gn.y);

  const darkness = 1 - asymptoticalReachOne(gn.density / 25);
  circle.setAttribute('fill', 'hsl(30, 50%, ' + (darkness * 50) + '%)');
}

class GravityEnvironment {

  constructor(svgElem) {
    this.nodes = new Map();
    this.svgElem = svgElem;
  }

  append(node) {
    const correspondingElement = this.addNewCircle(node);
    this.nodes.set(node, correspondingElement);
    return this.allNodes;
  }

  /**
   * @private
   */
  addNewCircle(gravityNode) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    applyGravityNodeOnSVGCircleNode(gravityNode, circle)

    this.svgElem.appendChild(circle);

    return circle;
  }

  get allNodes() {
    return this.nodes.values();
  }

  /**
   * @private
   */
  get allCircles() {
    return this.nodes.keys();
  }
}

function createAnimLoop(fnc) {
  let run = true;

  window.requestAnimationFrame(ts => {
    const start = ts;
    let last = ts;
    const looper = ts => {
      fnc(ts, ts - last, ts - start);
      last = ts;
      if (run)
        window.requestAnimationFrame(looper);
    };

    if (run)
      window.requestAnimationFrame(looper);
  })

  return {
    stop: () => run = false
  }
}

addEventListener('DOMContentLoaded', () => {
  const ge = new GravityEnvironment(document.getElementsByTagName('svg')[0]);
  ge.append(new GravityNode(30, 30, 10, 5));
  ge.append(new GravityNode(65, 30, 10, 10));

  const st = createAnimLoop((...args) => {
    console.log('called', ...args);
  });

  setTimeout(() => st.stop(), 5000);
})