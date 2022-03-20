import React from 'react';
import { Accordion } from 'react-bootstrap';

const FAQ: React.FC = () => {
  return (
    <>
      <h3>Frequently Asked Questions</h3>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>What's an LLF?</Accordion.Header>
          <Accordion.Body>
            LFF is an acronym for the Lithuanian <i>Laiko Fiksavimo Forma</i> which translates to <i>Time Tracking Form</i>. This document keeps track of your progress while doing a programming task and is required for some module tasks at Vilnius University.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>How to use it?</Accordion.Header>
          <Accordion.Body>
            <p>
              To use this project, you need to make commits to your repository according to these syntax rules:
            </p>
            <ol>
              <li>Commit message starts with <code>LFF:</code> (any other commits will be ignored).</li>
              <li>Everything after <code>LFF:</code> but until the first new line (<code>\n</code>) will be used for the <code>Activity</code> column.</li>
              <li>After the first new line (<code>\n</code>), everything will be used for the <code>Comments</code> column, except</li>
              <li>
                  Angle bracket notation that can be used anywhere in the commit message after <code>LFF:</code> in the format <code>{"<"}KEY=value1;value2;valuen{">"}</code>. Currently, we parse 2 types of keys:
                <ol>
                  <li>
                    Indicating the start time: <code>{"<"}START=HH:MM{">"}</code> or <code>{"<"}START=YYYY-MM-DD;HH:MM{">"}</code>
                  </li>
                  <li>
                    Indicating a disturbance (can be multiple): <code>{"<"}DISTURBANCE=HH:MM;reason{">"}</code>
                  </li>
                </ol>
              </li>
            </ol>
            <p>Examples:</p>
            <pre><code>git commit -m "LFF: Documentation" -m "Started writing documentation for new feature"</code></pre>
            <pre><code>git commit -m "LFF: Programming" -m {"\"Added feature X <START=13:06>\""}</code></pre>
            <pre><code>git commit -m "LFF: Programming" -m {"\"Refactored UI dropdown component <DISTURBANCE=00:23;Lunch>\""}</code></pre>
            <pre><code>git commit -m "LFF: Planning" -m {"\"Created class hierarchy <START=2022-03-20;16:32><DISTURBANCE=00:18;Taking out trash><DISTURBANCE=00:07;Phone call>\""}</code></pre>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>How does this work?</Accordion.Header>
          <Accordion.Body>
            This simple web application makes an HTTP GET request to GitHub's <a href='https://docs.github.com/en/rest'>REST API</a>, parses the response data according to the LFF table column rules and displays it to the user.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>I'm getting an error or can't see the table</Accordion.Header>
          <Accordion.Body>
            Make sure:
            <ol>
              <li>Your repository is public</li>
              <li>You have commits starting with <code>LFF:</code></li>
              <li>You haven't ran out of requests (60 per hour)</li>
              <li>You aren't expecting over 100 commits (which is the limit to <code>per_page</code> GitHub REST API query argument)</li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header>Can I contribute?</Accordion.Header>
          <Accordion.Body>
            Feel free to contribute to this project over on <a href='https://github.com/BenasB/vu-lff'>GitHub</a>. Create an issue if you'd like to add/request new features.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default FAQ;