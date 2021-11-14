import { Router } from 'express';
import { keys } from '../config';
import { User, UserType } from '../models';
import { sign, verify } from 'jsonwebtoken';

export const userRouter = Router();

userRouter.post('/login', (req, res, next) => {
  return res.status(200).json({
    message: 'Logged In'
  });
});

userRouter.post('/register', (req, res) => {
  return res.status(200).json({
    message: 'Registered'
  });
});

userRouter.post('/profile', (req, res) => {
  return res.status(200).json({
    message: 'Profile'
  });
});

userRouter.post('/search', (req, res) => {
  return res.status(200).json({
    message: 'Searched'
  });
});

userRouter.get('/logout', (req, res) => {
  return res.status(200).json({
    message: 'Logged Out'
  });
});

userRouter.get('/authenticated', (req, res) => {
  return res.status(200).json({
    message: 'Authenticated'
  });
});
