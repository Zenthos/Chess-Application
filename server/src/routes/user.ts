import { Router } from 'express';
import { keys } from '../config';
import { User, UserType } from '../models';
import { sign, verify } from 'jsonwebtoken';

export const userRouter = Router();

userRouter.post('/login', (req, res, next) => {
  return res.status(200);
});

userRouter.post('/register', (req, res) => {
  return res.status(200);
});

userRouter.post('/profile', (req, res) => {
  return res.status(200);
});

userRouter.post('/search', (req, res) => {
  return res.status(200);
});

userRouter.get('/logout', (req, res) => {
  return res.status(200);
});

userRouter.get('/authenticated', (req, res) => {
  return res.status(200);
});
