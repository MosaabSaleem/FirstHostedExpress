const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'client/build')));

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// Serve React for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const stripe = require('stripe')('sk_test_51QdPAbP2gp2kn1rn1Qz5ce1pEMw94Yb2XPTzZHlW62Sf3QhbGM45e8ZoOpTbD4Rag5aHEeIRDNy7sKK0zX8KWQK000b9t2WWYV');

app.post('/api/checkout', express.json(), async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    res.json({clientSecret: paymentIntent.client_secret});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});