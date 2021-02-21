import Message from './Message';

interface Queue {
  push(msgData: string): any,
  pop(): Message,
}
