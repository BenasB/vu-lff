import { Commit, LFFEntry } from "../components/ResponseDataHandler";
import CONSTANTS from "./constants";
import parse, { BrackedParseData } from "./parser";

const parseActivity: (message: string) => string | undefined = (message) => {
  const parts = message.split('\n');
  return parts[0].replace(CONSTANTS.COMMIT_START, '').trim();
}

const parseStartDate: (bracketData: BrackedParseData[], commit: Commit) => Date | undefined = (bracketData, commit) => {
  let result: Date | undefined = undefined;
  
  for(const data of bracketData) {
    if (data.name !== 'START') continue;

    if (data.arguments.length === 1)
      result = new Date(`${commit.date.toLocaleDateString(CONSTANTS.LOCALE)}T${data.arguments[0]}`);
    else if (data.arguments.length === 2)
      result = new Date(`${data.arguments[0]}T${data.arguments[1]}`);
  }

  return result;
}

const parseComments: (message: string, bracketData: BrackedParseData[]) => string | undefined = (message, bracketData) => {
  const parts = message.split('\n').filter(p => p.length !== 0);  
  return parts.slice(1).join(' ');
}

const parseCommit: (commit: Commit, previousCommit: Commit | null) => LFFEntry = (commit, previousCommit) => {
  const bracketData = parse(commit.message);
  let messageWithoutBracketData = commit.message;
  bracketData.forEach(data => {
    messageWithoutBracketData = messageWithoutBracketData.replace(data.originalBracketStringInMessage, '');
  });

  const notDeterminedMark = '?';
  const notParsedMark = '?';
  const fromDate: Date | undefined = parseStartDate(bracketData, commit) || previousCommit?.date || undefined; // TODO: Implement parsing <START=DATE;XX:XX>
  const toDate: Date = commit.date;
  const disturbanceTime: number = 0; // TODO: implement this parsing

  const entry: LFFEntry = {
    date: fromDate && fromDate.getDate() !== toDate.getDate() ? 
      `${fromDate.toLocaleDateString(CONSTANTS.LOCALE)} - ${toDate.toLocaleDateString(CONSTANTS.LOCALE)}` 
      : toDate.toLocaleDateString(CONSTANTS.LOCALE),
    from: fromDate ? fromDate.toLocaleTimeString(CONSTANTS.LOCALE, {hour: '2-digit', minute:'2-digit'}) : notDeterminedMark,
    to: toDate.toLocaleTimeString(CONSTANTS.LOCALE, {hour: '2-digit', minute:'2-digit'}),
    disturbances: disturbanceTime.toString(),
    time: fromDate ? new Date(toDate.getTime() - fromDate.getTime() - disturbanceTime).toISOString().slice(11, 16) : notDeterminedMark,
    activity: parseActivity(messageWithoutBracketData) || notParsedMark,
    comments: parseComments(messageWithoutBracketData, bracketData),
  }

  return entry;
}

export default parseCommit;