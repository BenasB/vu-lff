import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Form, InputGroup, FormControl, Button, Spinner, Alert } from 'react-bootstrap';
import getRepoData, { ResponseData } from '../helpers/getRepoData';
import ResponseDataHandler from './ResponseDataHandler';

interface FormData<T>{
  [key: string]: T | undefined;
  url: T;
  since?: T;
}

interface FormErrors extends FormData<boolean> {}
export interface FormValues extends FormData<string> {}

const errorMessages: FormData<string> = {
  url: 'This does not look like a valid URL to a GitHub repository :/',
  since: "The 'Since' date can't be in the future"
}

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
  };

  const isValidSinceDate: (dateString: string | undefined) => boolean = (dateString) => {
    return dateString ? Date.now() >= Date.parse(dateString) : true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const urlInputElement = form[0] as HTMLInputElement;
    const sinceInputElement = form[1] as HTMLInputElement;
    const repoPath = urlInputElement.value;
    const sinceDate = sinceInputElement.value;

    const isFormValid = form.checkValidity();

    // Use all validation functions here
    const formErrors: FormErrors = { 
      url: !isValidGithubRepoUrl(repoPath),
      since: !isValidSinceDate(sinceDate)
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

  const handleSinceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const dateString = event.currentTarget.value;
    setValues({...values, since: dateString});

    setErrors({...errors, since: !isValidSinceDate(dateString)});
  };

  const getErrorMessages: () => string[] = () => {
    const result: string[] = [];
    Object.keys(errorMessages).forEach(key => {
      if (errors[key]) result.push(errorMessages[key] || '')
    })

    return result;
  }

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
            <InputGroup.Text id="basic-addon1">
              Since
            </InputGroup.Text>
            <FormControl  
              type='date'
              value={values.since || ''}
              onChange={handleSinceChange}
              isInvalid={checkedValidation && errors.since}
              disabled={submitted && !response}
              max={new Date().toISOString().slice(0, 10)}
              />
            <Button
              variant="primary"
              id="button-addon2"
              type='submit'
              disabled={submitted && !response}
            >
              Generate
            </Button>
            {getErrorMessages().map(message => <Form.Control.Feedback type='invalid' key={message}>{message}</Form.Control.Feedback>)}
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
          <ResponseDataHandler {...response} />
        </>
        }
        {!response.success && <Alert variant='danger'>
            <Alert.Heading>Oh snap! You got an error :/</Alert.Heading>
            Failed to get the repository at <code><a href={`https://github.com/${response.startingUrl}`}>{`https://github.com/${response.startingUrl}`}</a></code> Are you sure it exists?
          </Alert>}
      </>}
    </>
  );
}

export default GitHubUrlForm;