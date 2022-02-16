import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Form, InputGroup, FormControl, Button, Spinner, Alert } from 'react-bootstrap';
import CommitTable from './CommitTable';
import getRepoData, { ResponseData } from './getRepoData';

interface FormData<T>{
  [key: string]: T;
  url: T;
}

interface FormErrors extends FormData<boolean> {}
export interface FormValues extends FormData<string> {}

const GitHubUrlForm: React.FC = () => {
  const [checkedValidation, setCheckedValidation] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({ url: false});
  const [values, setValues] = useState<FormValues>({ url: ''});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [response, setResponse] = useState<ResponseData | null>(null);

  // Each form input field should have a custom validation function like this (if it needs custom validation)
  const isValidGithubRepoUrl: (path: string) => boolean = (path) => {
    const parts = path.split('/');

    return parts.length === 2 && !parts.some(p => !p);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      setResponse(null);
      const responseData = await getRepoData(values);
      setResponse(responseData);
    }
  };

  // Also each form input field that needs custom validation should have a function like this
  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const repoPath = event.currentTarget.value;
    setValues({...values, url: repoPath});

    setErrors({...errors, url: !isValidGithubRepoUrl(repoPath)});
  };

  return (
    <>
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
              value={values.url}
              onChange={handleUrlChange}
              isInvalid={checkedValidation && errors.url}
              disabled={submitted && !response}
              />
            <Button
              variant="primary"
              id="button-addon2"
              type='submit'
              disabled={submitted && !response}
            >
              Generate
            </Button>
            <Form.Control.Feedback type='invalid'>This does not look like a valid URL to a GitHub repository :/</Form.Control.Feedback>
          </InputGroup>
      </Form>

      {submitted && !response && <>
      <Spinner animation="border" role="status" variant='primary' className='m-auto'>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      </>}
      {submitted && response && <>
        {response.success && response.data && response.requests && <>
          <Alert variant='info'>
            Requests left: {response.requests?.remaining}/{response.requests?.limit}. They will reset on {response.requests?.reset.toTimeString()}
          </Alert>
          <CommitTable messages={response.data.map(c => c.commit.message)}/>
        </>
        }
        {!response.success && <Alert variant='danger'>
            <Alert.Heading>Oh snap! You got an error :/</Alert.Heading>
            Failed to get the repository at <code><a href={`https://github.com/${values.url}`}>{`https://github.com/${values.url}`}</a></code>
          </Alert>}
      </>}
    </>
  );
}

export default GitHubUrlForm;