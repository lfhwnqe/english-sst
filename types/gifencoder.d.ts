// // types/gifencoder.d.ts
// import { CanvasRenderingContext2D } from 'canvas';
// import { Readable } from 'stream';

// declare module 'gifencoder' {
//   class GIFEncoder {
//     constructor(width: number, height: number);
//     createReadStream(): Readable;
//     start(): void;
//     setRepeat(repeat: number): void;
//     setDelay(delay: number): void;
//     setQuality(quality: number): void;
//     // 使用 node-canvas 的 CanvasRenderingContext2D 类型
//     // addFrame(context: string): void;
//     // addFrame(context: CanvasRenderingContext2D): void;
//     finish(): void;
//   }
//   export = GIFEncoder;
// }
