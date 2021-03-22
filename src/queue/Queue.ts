import Message from './Message';

export default interface Queue {
  push(msgData: string): Promise<void>,
  pop(): Promise<Message | undefined>,
}
