import MemoryQueue from './queue/MemoryQueue';
import Message from './queue/Message';
import Worker from './Worker';

jest.useFakeTimers();

const flushPromises = () => new Promise(setImmediate);

afterEach(() => {
  jest.clearAllTimers();
});

test('Pop message and execute action', async () => {
  const queue = new MemoryQueue();
  await queue.push("Hello World");

  let msg: string = "";

  const action = async (message: Message, w: Worker): Promise<void> => {
    msg = message.body;
    w.exit();
  };

  const worker = new Worker(queue, action, {});;

  await worker.run();

  expect(msg).toEqual('Hello World');
});

test('Pop messages from queue until exit', async () => {
  const queue = new MemoryQueue();
  await queue.push("1");
  await queue.push("2");
  await queue.push("3");

  const received: string[] = [];

  const action = async (message: Message, w: Worker): Promise<void> => {
    const msg: string = message.body;
    received.push(msg);
    if(msg === "3") {
      w.exit();
    }
  };

  const worker = new Worker(queue, action, {});;

  await worker.run();

  expect(received).toEqual(["1", "2", "3"]);
});

test('Backoff when queue has no message', async () => {
  const queue = new MemoryQueue();
  // tslint:disable-next-line:no-empty
  const action = async (message: Message, w: Worker): Promise<void> => {};
  const worker = new Worker(queue, action, {});;
  const backoffSpy = jest.spyOn(Worker.prototype as any, 'backoff');

  const run = worker.run();
  worker.exit();
  await flushPromises();
  jest.runAllTimers();
  await run;

  expect(backoffSpy).toHaveBeenCalled();
  expect(setTimeout).toHaveBeenCalled();
});

test('Backoff time is configurable through options object', async() => {
  const queue = new MemoryQueue();
  // tslint:disable-next-line:no-empty
  const action = async (message: Message, w: Worker): Promise<void> => {};
  const worker = new Worker(queue, action, {
    backoff: 1000,
  });;

  const run = worker.run();
  worker.exit();
  await flushPromises();
  jest.runAllTimers();
  await run;

  expect(setTimeout).toHaveBeenCalled();
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);;
});

