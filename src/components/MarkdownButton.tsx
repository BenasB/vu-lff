import React, { useState } from 'react';
import {markdownTable} from 'markdown-table'
import { LFFEntry } from './ResponseDataHandler';
import { Button } from 'react-bootstrap';

interface Props{
  entries: LFFEntry[];
}

const MarkdownButton: React.FC<Props> = ({entries}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const stringTable: string[][] = [
    ["Date", "From", "To", "Disturbances", "Time", "Activity", "Comments"],
  ];

  entries.forEach(e => {
    const stringRow: string[] = [
      e.date, e.from, e.to, e.disturbances?.join(', ') || '', e.time, e.activity, e.comments || ''
    ];
    stringTable.push(stringRow)
  })

  const mdString = markdownTable(stringTable)

  const copyToClipboard = () => {
    if (navigator?.clipboard)
    {
      navigator.clipboard.writeText(mdString);
      setCopied(true);
    }
  }

  return <Button onClick={() => copyToClipboard()} variant={copied ? "success" : "primary"}>Copy Markdown</Button>
}

export default MarkdownButton;