import Queue from './Queue';
import Message from './Message';

export default class MemoryQueue implements Queue {
  queue: string[];
  processingQueue: string[];

  constructor() {
    this.queue = [];
    this.processingQueue = [];
  }

  private removeFromProcessingQueue (msgData: string): void {
    const index = this.processingQueue.indexOf(msgData);
    this.processingQueue.splice(index, 1);
  }

  private retry(msgData: string): () => Promise<boolean> {
    return async (): Promise<boolean> => {
      this.queue.push(msgData);
      this.removeFromProcessingQueue(msgData);
      return true;
    };
  }

  private delete(msgData: string): () => Promise<boolean> {
    return async (): Promise<boolean> => {
      this.removeFromProcessingQueue(msgData);
      return true;
    };
  }

  public async push(msgData: string): Promise<void> {
    this.queue.push(msgData);
  }

  public pop(): Message | undefined {
    const queue = this.queue;
    const head = queue.shift();
    if(!head) return;
    this.processingQueue.push(head);
    return {
      body: head,
      retry: this.retry(head),
      delete: this.delete(head),
    };
  }
}

