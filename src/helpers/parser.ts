export interface BrackedParseData {
  name: string;
  arguments: string[];
  originalBracketStringInMessage: string;
}

const parse: (message: string) => BrackedParseData[] = (message) => {
  const regexResults = message.matchAll(/<(?<key>[^;=]+)=(?<value>[^>]+)>/gm);
  const results: BrackedParseData[] = [];

  for (const match of regexResults) {
    if (match?.groups?.key && match?.groups?.value)
    {
      results.push({
        originalBracketStringInMessage: match[0],
        name: match.groups.key,
        arguments: match.groups.value.split(';').filter(a => a)
      });
    }
  }

  return results;
}

export default parse;