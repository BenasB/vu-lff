import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { ReactComponent as Logo } from './logo.svg';

const Footer: React.FC = () => {
  return (
    <Navbar fixed='bottom' variant='dark' bg='dark'>
      <Container>
        <Navbar.Brand href="https://bx2.tech" >
          <Logo width={58} height={24}/>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Benas Budrys 2022
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Footer;