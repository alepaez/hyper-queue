import Message from './Message';

export default interface Queue {
  push(msgData: string): void,
  pop(): Message | undefined,
}
