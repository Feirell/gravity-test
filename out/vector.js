export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    unitVector() {
        const length = this.length();
        if (length == 0)
            return new Vector(0, 0);
        return this.multiplyByN(1 / length);
    }
    multiplyByN(n) {
        return new Vector(this.x * n, this.y * n);
    }
    divideByN(n) {
        return this.multiplyByN(1 / n);
    }
    addVector(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    setLength(length) {
        return this
            .unitVector()
            .multiplyByN(length);
    }
    flip() {
        return new Vector(this.x, this.y);
    }
    /**
     * in radians
     * @param a
     */
    rotate(a) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return new Vector(this.x * c - this.y * s, this.x * s + this.y * c);
    }
}
