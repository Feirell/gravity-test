export class RingBuffer<T>{
    private readonly buffer: T[];

    private endPointer = 0;

    public fillLength = 0;

    constructor(public readonly bufferLength: number) {
        this.buffer = new Array(bufferLength);
    }

    push(value: T) {
        this.buffer[this.endPointer] = value;

        const bl = this.bufferLength;
        this.endPointer = (this.endPointer + 1) % bl;

        if (this.fillLength < bl)
            this.fillLength++;
    }

    pop() {
        if (this.fillLength == 0)
            return;

        const bl = this.bufferLength;
        const position = this.endPointer = (bl + this.endPointer - 1) % bl

        const value = this.buffer[position];
        this.buffer[position] = null as any; // to eliminate references

        this.fillLength--;
        return value;
    }

    unShift() {
        const bl = this.bufferLength;
        const position = (bl + this.endPointer - this.fillLength) % bl;

        const value = this.buffer[position]
    }

    shift() {
        if (this.fillLength == 0)
            return;

        const bl = this.bufferLength;
        const position = (bl + this.endPointer - this.fillLength) % bl;

        const value = this.buffer[position];
        this.buffer[position] = null as any; // to eliminate references

        this.fillLength--;
        return value;
    }

    private toIndex(n: number) {
        n = (n | 0) % this.fillLength;

        if (n < 0)
            n = (this.fillLength + n) % this.fillLength;

        return (
            this.bufferLength + n + this.endPointer - this.fillLength
        ) % this.bufferLength;
    }

    get(index: number) {
        index = this.toIndex(index);
        return this.buffer[index];
    }

    set(index: number, value: T) {
        index = this.toIndex(index);
        return this.buffer[index] = value;
    }

    *[Symbol.iterator]() {
        for (let offset = 0; offset < this.fillLength; offset++)
            yield this.buffer[this.toIndex(offset)];
    }

    toJSON() {
        return Array.from(this);
    }
}