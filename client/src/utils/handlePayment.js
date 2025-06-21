import axios from "axios";

export const handlePayment = async (amount) => {
  if (!window.Cashfree) {
    alert("❌ Cashfree SDK not loaded");
    return;
  }

  try {
    const res = await axios.post("http://localhost:4000/api/cashfree/create-order", {
      amount: amount,
    });

    const paymentSessionId = res.data.payment_session_id;

    const cashfree = new window.Cashfree({
      mode: "sandbox", // use "production" in live
    });

    await cashfree.checkout({
      paymentSessionId: paymentSessionId,
      redirect: false,
    });

  } catch (error) {
    alert("❌ Payment Failed");
    console.error(error);
  }
};
