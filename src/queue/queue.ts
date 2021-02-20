import Message from './message';

interface Queue {
  push(msgData: string): any,
  pop(): Message,
}
