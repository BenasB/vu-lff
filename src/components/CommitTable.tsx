import React from 'react';

interface Props{
    messages: string[];
}

const CommitTable: React.FC<Props> = ({messages}) => {
    return (
        <>
        {messages.map((m, k) => {
            return <div key={k}><p>{m}</p></div>
        })}
        </>
    );
};

export default CommitTable;