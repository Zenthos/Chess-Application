import React from 'react';
import { Alert as ReactBSAlert } from 'react-bootstrap';
import FadeIn from '../Animations/fade-in';

const Alert = ({ status, message }) => {
  return (
    <FadeIn>
      <ReactBSAlert variant={status}>
        { message }
      </ReactBSAlert>
    </FadeIn>
  )
}

export default Alert;