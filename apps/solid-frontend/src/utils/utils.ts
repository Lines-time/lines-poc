export const scale = (value: number, maxIn: number, minIn: number, maxOut: number, minOut: number): number => {
    return ((value - minIn) / (maxIn - minIn)) * (maxOut - minOut) + minOut;
};
