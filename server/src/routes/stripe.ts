import { Router } from 'express';
import { Stripe } from 'stripe';
import { keys } from '../config';

export const stripeRouter = Router();

stripeRouter.post('/create-checkout-session', async (req, res) => {
  try {
    const stripe = new Stripe(keys.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
          name: 'Test',
          description: 'Test Transaction',
          amount: 1,
          currency: 'USD',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/login',
      cancel_url: 'http://localhost:3000/register',
    });

    return res.redirect(303, session.url || '/');
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'errored' });
  }
});
