import React, { useEffect, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch client secret from backend
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }) // amount in cents
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // stays in app
      },
      redirect: 'if_required'
    });

    if (stripeError) {
      setError(stripeError.message);
    } else {
      alert('Payment successful!');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      <button type="submit" disabled={!stripe || loading || !clientSecret}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

export default CheckoutForm;