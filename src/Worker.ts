import Queue from './queue/Queue';
import Message from './queue/Message';
import WorkerOptions from './WorkerOptions';

type WorkerDefaultOptions = {
  backoff: number,
}

export default class Worker {
  private queue: Queue;
  private action: (msg: Message, w: Worker) => Promise<void>;
  private options: WorkerOptions;
  private defaultOptions: WorkerDefaultOptions;
  private exited: boolean;

  constructor(queue: Queue, action: (msg: Message, w: Worker) => Promise<void>, options: WorkerOptions) {
    this.queue = queue;
    this.action = action;
    this.options = options;
    this.exited = false;
    this.options = options;
    this.defaultOptions = {
      backoff: 500,
    };
  };

  private backoff(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, this.options.backoff || this.defaultOptions.backoff);
    });
  };

  private async processMessage(): Promise<void> {
    const message: Message | undefined = this.queue.pop();
    if(message) {
      await this.action(message, this);
    } else {
      await this.backoff();
    };
  };

  public async run(): Promise<void> {
    while(!this.exited) {
      await this.processMessage();
    }
  };

  public exit(): void {
    this.exited = true;
  };
}
