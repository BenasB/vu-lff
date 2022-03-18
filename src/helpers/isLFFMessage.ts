const isLFFMessage: (message: string) => boolean = (message) => {
  return message.trimStart().startsWith("LFF:");
}

export default isLFFMessage;