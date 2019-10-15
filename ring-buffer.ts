export class RingBuffer<T>{
    private readonly buffer: T[];

    private endPointer = 0;
    private length = 0;

    constructor(length: number) {
        this.buffer = new Array(length);
    }

    append(value: T) {
        this.buffer[this.endPointer] = value;
        this.endPointer = (this.endPointer + 1) % this.buffer.length;

        if (this.length < this.buffer.length)
            this.length++;
    }

    *[Symbol.iterator]() {
        for (let offset = this.length; offset > 0; offset--) {
            const n = (this.buffer.length + this.endPointer - offset) % this.buffer.length;
            yield this.buffer[n];
        }
    }
}