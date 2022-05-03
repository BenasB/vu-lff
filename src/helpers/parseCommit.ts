import { Commit, LFFEntry } from "../components/ResponseDataHandler";
import CONSTANTS from "./constants";
import getDurationString from "./getDurationString";
import getTimeString from "./getTimeString";
import parse, { BrackedParseData } from "./parser";

interface Disturbance {
  duration: number;
  reason: string;
}

const parseActivity: (message: string) => string | undefined = (message) => {
  const parts = message.split('\n');
  return parts[0].replace(CONSTANTS.COMMIT_START, '').trim();
}

const parseStartDate: (bracketData: BrackedParseData[], commit: Commit) => Date | undefined = (bracketData, commit) => {
  let result: Date | undefined = undefined;
  
  for(const data of bracketData) {
    if (data.name !== 'START') continue;

    if (data.arguments.length === 1)
      result = new Date(`${commit.date.toLocaleDateString(CONSTANTS.LOCALE)}T${data.arguments[0].padStart(5, '0')}`);
    else if (data.arguments.length === 2)
      result = new Date(`${data.arguments[0]}T${data.arguments[1].padStart(5, '0')}`);
  }

  return result;
}

const parseDisturbances: (bracketData: BrackedParseData[]) => Disturbance[] = (bracketData) => {
  let results: Disturbance[] = [];
  
  for(const data of bracketData) {
    if (data.name !== 'DISTURBANCE') continue;

    if (data.arguments.length === 2)
      results.push({
        duration: Date.parse('1970-01-01T' + data.arguments[0].padStart(5, '0') + 'Z'),
        reason: data.arguments[1]
      })
  }

  return results;
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
  const fromDate: Date | undefined = parseStartDate(bracketData, commit) || previousCommit?.date || undefined;
  const toDate: Date = commit.date;
  const disturbances: Disturbance[] = parseDisturbances(bracketData);
  const totalDisturbanceTime: number = disturbances.reduce<number>((all, curr) => all += curr.duration, 0);

  const entry: LFFEntry = {
    date: fromDate && fromDate.getDate() !== toDate.getDate() ? 
      `${fromDate.toLocaleDateString(CONSTANTS.LOCALE)} - ${toDate.toLocaleDateString(CONSTANTS.LOCALE)}` 
      : toDate.toLocaleDateString(CONSTANTS.LOCALE),
    from: fromDate ? getTimeString(fromDate) : notDeterminedMark,
    to: getTimeString(toDate),
    disturbances: disturbances.map(d => `${d.reason} ${getDurationString(d.duration)}`),
    time: fromDate ? getDurationString(toDate.getTime() - fromDate.getTime() - totalDisturbanceTime) : notDeterminedMark,
    activity: parseActivity(messageWithoutBracketData) || notParsedMark,
    comments: parseComments(messageWithoutBracketData, bracketData),
  }

  return entry;
}

export default parseCommit;
