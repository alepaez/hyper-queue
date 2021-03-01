export default interface Message {
  body: string,
  retry(): Promise<boolean>,
  delete(): Promise<boolean>,
}
