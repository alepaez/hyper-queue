![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/alepaez/hyper-queue/tests/main)
![Coveralls branch](https://img.shields.io/coveralls/github/alepaez/hyper-queue/main)

# Basic Usage:

## Available Brokers

- [SQSQueue](https://github.com/alepaez/hyper-queue-sqs)

## Worker

```typescript
import { Worker, Message } from 'hyperq';

const queue = // Use one of the available brokers above

const action = async (message: Message, w: Worker): Promise<void> => {
  const msg = message.body;
  try {
    // ...do your thing
  } catch(e) {
    await message.retry(); // Message goes back to the queue instantly
  }
  await message.delete(); // Message is deleted forever
};

const start: () => void = async () => {
  const worker = new Worker(queue, action, {});;

  const exit = () => {
    worker.exit();
    console.log('Exiting...');
  }

  process.on('SIGTERM', exit);
  process.on('SIGINT', exit);

  console.log('Running...')
  await worker.run();
  process.exit(0);
};

start();
```

## Send messages

```typescript
const queue = // Use one of the available brokers above

await queue.push("My message"); // You can serialize more complex information using JSON
```

