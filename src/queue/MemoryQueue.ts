import Queue from './Queue';
import Message from './Message';

export default class MemoryQueue implements Queue {
  queue: string[];
  processingQueue: string[];

  constructor() {
    this.queue = [];
    this.processingQueue = [];
  }

  private removeFromProcessingQueue (msgData): void {
    const index = this.processingQueue.indexOf(msgData);
    this.processingQueue.splice(index, 1);
  }

  private retry(msgData: string): () => boolean {
    return async (): boolean => {
      this.queue.push(msgData);
      this.removeFromProcessingQueue(msgData);
      return true;
    };
  }

  private delete(msgData: string): () => boolean {
    return async (): boolean => {
      this.removeFromProcessingQueue(msgData);
      return true;
    };
  }

  public push(msgData: string): void {
    this.queue.push(msgData);
  }

  public pop(): Message {
    const queue = this.queue;
    const head = queue.shift();
    this.processingQueue.push(head);
    return {
      body: head,
      retry: this.retry(head),
      delete: this.delete(head),
    };
  }
}

