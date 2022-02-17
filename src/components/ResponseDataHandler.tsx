import React from 'react';
import { ResponseData } from '../helpers/getRepoData';
import isLFFMessage from '../helpers/isLFFMessage';
import parseCommit from '../helpers/parseCommit';
import CommitTable from './CommitTable';

export interface Commit {
  message: string;
  date: Date;
}

export interface LFFEntry {
  date: string;
  from: string;
  to: string;
  disturbances?: string;
  time: string;
  activity: string;
  comments?: string;
}

const ResponseDataHandler: React.FC<ResponseData> = (response) => {
  if (!response.data) return null;

  const commits: Commit[] = response.data.map(c => { 
      return ( 
        {
          message: c.commit.message,
          date: c.commit.committer?.date ? new Date(Date.parse(c.commit.committer.date)) : new Date(0),
        }
      )
    }
  )
  .filter(c => isLFFMessage(c.message))
  .sort((a,b) => a.date.getTime() - b.date.getTime());

  const entries: LFFEntry[] = [];
  
  for (let i = 0; i < commits.length; i++)
  {
    const previousCommit = commits[i-1];
    entries.push(parseCommit(commits[i], previousCommit));
  }

  return (
    <>
      <CommitTable entries={entries}/>
    </>
  )
}

export default ResponseDataHandler;