export class GravityNode {

  constructor(x, y, radius = 2, density = 1) {
    this.x = x;
    this.y = y;

    this.radius = radius;
    this.density = density;
  }

  get mass() {
    console.log('called getter');
    return Math.PI * this.radius * this.radius * this.density;
  }

  setMassChangeRadius(v) {
    this.radius = Math.sqrt(v / (Math.PI * this.density));
  }

  setMassChangeDensity(v) {
    this.density = v / (Math.PI * this.radius * this.radius);
  }

  addVector(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  flip() {
    return new Vector(-this.x, -this.y);
  }
}
