import CONSTANTS from "./constants";

const isLFFMessage: (message: string) => boolean = (message) => {
  return message.trimStart().startsWith(CONSTANTS.COMMIT_START);
}

export default isLFFMessage;