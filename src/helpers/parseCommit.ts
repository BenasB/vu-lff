import { Commit, LFFEntry } from "../components/ResponseDataHandler";

const parseActivity: (message: string) => string | undefined = (message) => {
  const parts = message.split('\n');
  return parts[0].substring(4);
}

const parseComments: (message: string) => string | undefined = (message) => {
  const parts = message.split('\n').filter(p => p.length !== 0);
  return(parts.slice(1).join());
}

const parseCommit: (commit: Commit, previousCommit: Commit | null) => LFFEntry = (commit, previousCommit) => {
  const notDeterminedMark = '?';
  const notParsedMark = '?'
  const fromDate: Date | undefined = previousCommit ? previousCommit.date : undefined; // TODO: Implement parsing <START=XX:XX>
  const toDate: Date = commit.date;
  const disturbanceTime: number = 0; // TODO: implement this parsing

  const entry: LFFEntry = {
    date: fromDate && fromDate.getDate() !== toDate.getDate() ? 
      `${fromDate.toLocaleDateString("lt-LT")} - ${toDate.toLocaleDateString("lt-LT")}` 
      : toDate.toLocaleDateString("lt-LT"),
    from: fromDate ? fromDate.toLocaleTimeString("lt-LT", {hour: '2-digit', minute:'2-digit'}) : notDeterminedMark,
    to: toDate.toLocaleTimeString("lt-LT", {hour: '2-digit', minute:'2-digit'}),
    disturbances: disturbanceTime.toString(),
    time: fromDate ? new Date(toDate.getTime() - fromDate.getTime() - disturbanceTime).toISOString().slice(11, 16) : notDeterminedMark,
    activity: parseActivity(commit.message) || notParsedMark,
    comments: parseComments(commit.message),
  }

  return entry;
}

export default parseCommit;