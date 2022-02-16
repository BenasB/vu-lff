import React from 'react';
import { Container, Stack } from 'react-bootstrap';
import GitHubUrlForm from './GitHubUrlForm';

const App: React.FC = () => {
  return (
    <>
    <Container>
      <Stack gap={3}>
        <h1 className='text-center mt-5'>VU LFF</h1>
        <GitHubUrlForm/>
      </Stack>
    </Container>
    </>
  );
}

export default App;
