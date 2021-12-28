import React from 'react';
import { Alert as MaterialAlert, AlertProps } from '@mui/material';

export interface AlertState {
  text: string;
  display: boolean;
  severity: AlertProps['severity'];
}

export const Alert = ({ state }: { state: AlertState }) => {
  return (
    <React.Fragment>
      {state.display && (
        <MaterialAlert severity={state.severity || 'error'}>
          {state.text}
        </MaterialAlert>
      )}
    </React.Fragment>
  );
};
