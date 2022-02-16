import React from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';

const GitHubUrlForm: React.FC = () => {
  return (
    <Form>
      <Form.Label htmlFor="github-url">Your GitHub repository URL</Form.Label>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">
          https://github.com/
        </InputGroup.Text>
        <FormControl id="github-url" aria-describedby="basic-addon1" placeholder='BenasB/vu-lff'/>
        <Button variant="primary" id="button-addon2">
          Generate
        </Button>
      </InputGroup>
    </Form>
  )
}

export default GitHubUrlForm;