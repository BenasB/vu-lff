import React from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';

const GitHubUrlForm: React.FC = () => {
  return (
    <Form>
      <Form.Label htmlFor="basic-url">Your GitHub repository URL</Form.Label>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon3">
          https://github.com/
        </InputGroup.Text>
        <FormControl id="basic-url" aria-describedby="basic-addon3" placeholder='BenasB/vu-lff'/>
        <Button variant="primary" id="button-addon2">
          Parse
        </Button>
      </InputGroup>
    </Form>
  )
}

export default GitHubUrlForm;