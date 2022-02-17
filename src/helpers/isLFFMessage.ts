const isLFFMessage: (message: string) => boolean = (message) => {
  return message.slice(0,3) === 'LFF';
}

export default isLFFMessage;