import { getVectorFromTwoPoints } from "./util.js";
import { Vector } from "./vector.js";
import { RingBuffer } from "./ring-buffer.js";

export class GravityNode {

  public lockPosition = false;

  public tail = new RingBuffer<Vector>(55);
  public tailPushTime = 1;
  private tailPrimer = 0;

  constructor(
    public position: Vector,

    public radius: number = 2,
    public density: number = 1,
    public velocity = new Vector(0, 0),
    public acceleration = new Vector(0, 0)
  ) { }

  get mass() {
    return Math.PI * this.radius * this.radius * this.density;
  }

  setMassChangeRadius(v: number) {
    this.radius = Math.sqrt(v / (Math.PI * this.density));
  }

  setMassChangeDensity(v: number) {
    this.density = v / (Math.PI * this.radius * this.radius);
  }

  public getForceVector(inflictingNode: GravityNode) {
    const aToB = getVectorFromTwoPoints(this.position, inflictingNode.position);

    const G = 6.6743 ** -11;
    const radius = aToB.length();

    const force = G * this.mass * inflictingNode.mass / (radius * radius);

    return aToB
      .setLength(force);
  }

  public applyForce(force: Vector) {
    this.acceleration = force.divideByN(this.mass);
  }

  public updateVelocity(timeDelta: number) {
    this.velocity = this.acceleration
      .multiplyByN(timeDelta)
      .addVector(this.velocity);
  }

  public updatePosition(timeDelta: number) {
    if (this.lockPosition)
      return;

    this.position = this.velocity
      .multiplyByN(timeDelta)
      .addVector(this.position);

    if (this.tailPrimer++ % this.tailPushTime == 0)
      this.tail.push(this.position);
  }

  public getForceVectorsForNode(otherNodes: GravityNode[]) {
    const forces = [];
    for (const otherNode of otherNodes) {
      if (otherNode == this)
        continue;

      forces.push(this.getForceVector(otherNode));
    }

    return forces;
  }

  public getForceVectorForNode(otherNode: GravityNode[]) {
    let force = new Vector(0, 0);
    const forces = this.getForceVectorsForNode(otherNode);

    for (const singleForce of forces)
      force = force.addVector(singleForce);

    return force;
  }

  toJSON() {
    return { ...this, mass: this.mass };
  }
}
