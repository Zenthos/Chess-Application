import React, { useState, useEffect } from 'react';
import { ProductCard } from './Components';
import { Grid } from '@mui/material';

export const Shop = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success'))
      setMessage('Order placed! You will receive an email confirmation.');

    if (query.get('canceled'))
      setMessage('Order canceled -- continue to shop around and checkout when you\'re ready.');
  }, []);

  return (
    <React.Fragment>
      <Grid container>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val, index) => (
          <Grid key={`product-${val}`} item md={4} sm={6} xs={12}>
            <ProductCard index={index} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
};
