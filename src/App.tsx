import React from 'react';
import { Container, Stack } from 'react-bootstrap';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import GitHubUrlForm from './components/GitHubUrlForm';

const App: React.FC = () => {
  return (
    <>
      <Container className='mt-5' style={{marginBottom: '100px'}}>
        <Stack gap={3}>
          <h1 className='text-center'>VU LFF</h1>
          <h3 className='text-muted text-center'>Generate an LFF from your repository commit messages</h3>
          <GitHubUrlForm/>
          <FAQ/>
        </Stack>
      </Container>
      <Footer/>
    </>
  );
}

export default App;
