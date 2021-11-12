import React from 'react';
import { Alert, AlertProps } from 'react-bootstrap';
import FadeIn from './fade-in';

export interface CustomAlertProps {
  status: AlertProps['variant'];
  message: string;
}

export const CustomAlert = ({ status = 'success', message }: CustomAlertProps) => {
  return (
    <FadeIn>
      <Alert variant={status}>
        { message }
      </Alert>
    </FadeIn>
  );
};
