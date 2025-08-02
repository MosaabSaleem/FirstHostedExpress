import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51QdPAbP2gp2kn1rnRPub4TtoVXqNPnOOr7L4f1D78rCQjOg41s764j9CMyIfESE8yqRodEwbzkRSVSxq5Uwh7kxZ00z4x5tMTQ');

function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }) // amount in cents
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const options = {
    clientSecret,
    appearance: {}, // optional: customize Stripe UI
  };

  return (
    clientSecret && (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    )
  );
}

export default StripeCheckout;