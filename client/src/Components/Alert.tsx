import React from 'react';
import { Alert as ReactBSAlert } from 'react-bootstrap';
import FadeIn from './fade-in';

const Alert = ({ status, message }: any) => {
  return (
    <FadeIn>
      <ReactBSAlert variant={status}>
        { message }
      </ReactBSAlert>
    </FadeIn>
  );
};

export default Alert;
