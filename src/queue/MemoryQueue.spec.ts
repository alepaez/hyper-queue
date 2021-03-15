import MemoryQueue from './MemoryQueue';
import Message from './Message';

const createQueue = (messages: string[]) => {
  const queue = new MemoryQueue();
  queue.queue = messages;
  return queue;
}

test('push msg to the end of the queue', async () => {
  const queue = createQueue(['abajur', 'folha']);
  await queue.push('msg');
  expect(queue.queue).toEqual(['abajur', 'folha', 'msg']);
});

test('pop return the first message on the queue', () => {
  const queue = createQueue(['abajur', 'folha']);
  const msg = queue.pop();
  expect(msg?.body).toEqual('abajur');
});

test('pop returns undefined on empty queue', () => {
  const queue = createQueue([]);
  const msg = queue.pop();
  expect(msg).toEqual(undefined);
})

test('pop removes msg from the queue', () => {
  const queue = createQueue(['abajur', 'folha']);
  const msg = queue.pop();
  expect(queue.queue).toEqual(['folha']);
});

test('pop adds msg to the processingQueue', () => {
  const queue = createQueue(['abajur', 'folha']);
  const msg = queue.pop();
  expect(queue.processingQueue).toEqual(['abajur']);
});

test('message retry put msg back to the queue', async () => {
  const queue = createQueue(['abajur', 'folha']);
  const msg = queue.pop();
  await msg?.retry();
  expect(queue.queue).toEqual(['folha', 'abajur']);
});

test('message retry removes msg from the processing Queue', async () => {
  const queue = createQueue(['abajur', 'folha']);
  const msg = queue.pop();
  await msg?.retry();
  expect(queue.processingQueue).toEqual([]);
});

test('message delete removes msg from the processing Queue', async () => {
  const queue = createQueue(['abajur', 'folha']);
  const msg = queue.pop();
  await msg?.delete();
  expect(queue.processingQueue).toEqual([]);
  expect(queue.queue).toEqual(['folha']);
});
