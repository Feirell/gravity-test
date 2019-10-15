/**
 * This seems to be rather difficult, but it only enables one to access the RingBuffer like
 * an array and to promote the length attribute
 */

// const isInNumberRange = (v: any, start: number, end: number) =>
//     (v | 0) === v
//     && v >= start
//     && v < end;

// const RingBufferIterableHelper: ProxyHandler<RingBuffer<any>> = {
//     set(target, key, value, receiver) {
//         if (typeof key == 'string') {
//             const castValue = +key;

//             if (isInNumberRange(castValue, 0, target.fillLength))
//                 return target.set(castValue, value);
//         }

//         return Reflect.set(target, key, value, receiver);
//     },
//     get(target, key, receiver) {
//         if (typeof key == 'string') {
//             const castValue = +key;

//             if (isInNumberRange(castValue, 0, target.fillLength))
//                 return target.get(castValue);
//         }

//         return Reflect.get(target, key, receiver);
//     },
//     getOwnPropertyDescriptor(target, key) {
//         if (typeof key == 'string') {
//             const castValue = +key;

//             if (isInNumberRange(castValue, 0, target.fillLength))
//                 return {
//                     configurable: true,
//                     enumerable: true,
//                     writable: true,
//                     value: target.get(castValue)
//                 };
//         }

//         return Reflect.getOwnPropertyDescriptor(target, key);
//     },
//     ownKeys(target) {
//         const extra = ['fillLength'];
//         for (let i = 0; i < target.fillLength; i++)
//             extra.push('' + i);

//         return Reflect.ownKeys(target).concat(extra);
//     }
// }

export class RingBuffer<T>{
    private readonly buffer: T[];

    private endPointer = 0;

    public fillLength = 0;

    constructor(public readonly bufferLength: number
        // , enableArrayAccess = false
    ) {
        this.buffer = new Array(bufferLength);

        // if (enableArrayAccess)
        //     return new Proxy(this, RingBufferIterableHelper);
    }

    // [key: number]: T

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