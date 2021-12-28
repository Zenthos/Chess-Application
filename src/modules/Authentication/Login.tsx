import React, { useState } from 'react';
import Link from 'next/link';
import { Alert, AlertState } from '@common';
import { Button, TextField, Box, Paper, Typography, Container } from '@mui/material';

export const Login = () => {
  const [message, setMessage] = useState<AlertState>({
    text: 'The login system is currently being revamped, check back later.',
    display: true,
    severity: 'warning',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        sx={{
          p: 4,
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login to your account
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Alert state={message} />
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="off"
            sx={{ mt: 2 }}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="off"
            sx={{ mt: 2 }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
          <Box display="flex" justifyContent="space-between">
            <Typography>
              Forgot password?
            </Typography>
            <Link href="/user/register">
              Need an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
