require("dotenv").config();
const stripe = require("stripe")("pk_test_51Qos0bGhpdCpCvFScxcUFH40bZk2LMSyZtbunScBjIbQexJOPhupEd8V7jdmvgcF3qKngxlT6F616lmgXIJFEUmz00Qwyipzfy");
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { amount } = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentIntent })
    };
  } catch (error) {
      console.log({ error });

      return {
        statusCode: 400,
        body: JSON.stringify({ error })
      };
  }
};
