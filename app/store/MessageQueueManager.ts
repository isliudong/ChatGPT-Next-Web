export class MessageQueueManager {
    private queue: Promise<void>;
    private lastHandledTime: number;
    private readonly delayTime:number; // 每10ms处理一条消息

    constructor(delayTime: number = 10) {
        this.queue = Promise.resolve();
        this.lastHandledTime = Date.now(); // 初始化上一次处理时间为当前时间
        this.delayTime = delayTime;
    }
    // 添加消息到队列中并确保它们按顺序处理
    enqueue(messageHandler: () => void) {
        this.queue = this.queue.then(() => {
            return new Promise<void>((resolve) => {
                const currentTime = Date.now();
                const timeSinceLastHandled = currentTime - this.lastHandledTime;
                // 如果间隔小于10ms，则等待剩余时间
                const delay = Math.max(this.delayTime - timeSinceLastHandled, 0);
                setTimeout(() => {
                    console.log("execute task")
                    messageHandler();
                    this.lastHandledTime = Date.now(); // 更新上一次处理时间
                    resolve();
                }, delay);
            });
        });
    }
}
