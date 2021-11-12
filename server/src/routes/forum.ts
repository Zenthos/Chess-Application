import { Router } from 'express';

export const forumRouter = Router();

forumRouter.post('/:category', (req, res, next) => {
  return res.status(200);
});

forumRouter.post('/:category/:thread', (req, res) => {
  return res.status(200);
});
