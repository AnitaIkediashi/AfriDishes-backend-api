require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
var cors = require("cors");
const express = require("express");

const app = express();
app.use(
  cors({
    origin: "https://afridishes-frontend.onrender.com, *",
  })
);
app.use(express.json());

app.post("/checkout", async (req, res) => {
  const items = req.body.items;
  let lineItems = [];
  items.forEach((item) => {
    lineItems.push({
      price: item.id,
      quantity: item.cartQuantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://afridishes-frontend.onrender.com/checkout-success",
    cancel_url: "https://afridishes-frontend.onrender.com/checkout-cancel",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`running on port ${port}`));
