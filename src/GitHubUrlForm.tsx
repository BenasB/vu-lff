import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Form, InputGroup, FormControl, Button, Spinner } from 'react-bootstrap';

interface FormErrors{
  [key: string]: boolean;
  url: boolean;
}

const GitHubUrlForm: React.FC = () => {
  const [checkedValidation, setCheckedValidation] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({ url: false});
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Each form input field should have a custom validation function like this (if it needs custom validation)
  const isValidGithubRepoUrl: (path: string) => boolean = (path) => {
    const parts = path.split('/');

    return parts.length === 2 && !parts.some(p => !p);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const inputElement = form[0] as HTMLInputElement;
    const repoPath = inputElement.value;

    const isFormValid = form.checkValidity();

    // Use all validation functions here
    const formErrors: FormErrors = { 
      url: !isValidGithubRepoUrl(repoPath) 
    };

    setErrors(formErrors);
    event.preventDefault();
    event.stopPropagation();
    setCheckedValidation(true);

    if (isFormValid && Object.keys(formErrors).every(k => !formErrors[k])){
      setSubmitted(true);
    }
  };

  // Also each form input field that needs custom validation should have a function like this
  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const repoPath = event.currentTarget.value;

    setErrors({...errors, url: !isValidGithubRepoUrl(repoPath)});
  };

  if (!submitted)
  {
    return (
      <Form noValidate onSubmit={(event) => handleSubmit(event)}>
        <Form.Label htmlFor="github-url">Your GitHub repository URL</Form.Label>
        <InputGroup className="mb-3" hasValidation>
          <InputGroup.Text id="basic-addon1">
            https://github.com/
          </InputGroup.Text>
          <FormControl 
            id="github-url" 
            aria-describedby="basic-addon1" 
            placeholder='BenasB/vu-lff' 
            required 
            type='text' 
            onChange={handleUrlChange}
            isInvalid={checkedValidation && errors.url}
            />
          <Button variant="primary" id="button-addon2" type='submit'>
            Generate
          </Button>
          <Form.Control.Feedback type='invalid'>This does not look like a valid URL to a GitHub repository :/</Form.Control.Feedback>
        </InputGroup>
      </Form>
    );
  }else{
    return (
      <Spinner animation="border" role="status" variant='primary' className='m-auto'>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
}

export default GitHubUrlForm;