import React from 'react';
import { Container, Stack } from 'react-bootstrap';
import FAQ from './FAQ';
import Footer from './Footer';
import GitHubUrlForm from './GitHubUrlForm';

const App: React.FC = () => {
  return (
    <>
      <Container>
        <Stack gap={3}>
          <h1 className='text-center mt-5'>VU LFF</h1>
          <GitHubUrlForm/>
          <FAQ/>
        </Stack>
      </Container>
      <Footer/>
    </>
  );
}

export default App;
