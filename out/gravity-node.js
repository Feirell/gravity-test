import { getVectorFromTwoPoints } from "./util.js";
import { Vector } from "./vector.js";
import { RingBuffer } from "./ring-buffer.js";
export class GravityNode {
    constructor(position, radius = 2, density = 1, velocity = new Vector(0, 0), acceleration = new Vector(0, 0)) {
        this.position = position;
        this.radius = radius;
        this.density = density;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.lockPosition = false;
        this.tail = new RingBuffer(250);
        this.tailPushTime = 3;
        this.tailPrimer = 0;
    }
    get mass() {
        return Math.PI * this.radius * this.radius * this.density;
    }
    setMassChangeRadius(v) {
        this.radius = Math.sqrt(v / (Math.PI * this.density));
    }
    setMassChangeDensity(v) {
        this.density = v / (Math.PI * this.radius * this.radius);
    }
    getForceVector(inflictingNode) {
        const aToB = getVectorFromTwoPoints(this.position, inflictingNode.position);
        const G = 6.6743 ** -11;
        const radius = aToB.length();
        const force = G * this.mass * inflictingNode.mass / (radius * radius);
        return aToB
            .setLength(force);
    }
    applyForce(force) {
        this.acceleration = force.divideByN(this.mass);
    }
    updateVelocity(timeDelta) {
        this.velocity = this.acceleration
            .multiplyByN(timeDelta)
            .addVector(this.velocity);
    }
    updatePosition(timeDelta) {
        if (this.lockPosition)
            return;
        this.position = this.velocity
            .multiplyByN(timeDelta)
            .addVector(this.position);
        if (this.tailPrimer++ % this.tailPushTime == 0)
            this.tail.push(this.position);
    }
    getForceVectorsForNode(otherNodes) {
        const forces = [];
        for (const otherNode of otherNodes) {
            if (otherNode == this)
                continue;
            forces.push(this.getForceVector(otherNode));
        }
        return forces;
    }
    getForceVectorForNode(otherNode) {
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
