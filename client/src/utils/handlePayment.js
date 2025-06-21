import axios from "axios";

export const handlePayment = async ({ amount, email, phoneNumber, navigate, enqueueSnackbar }) => {
  if (!window.Cashfree) {
    enqueueSnackbar("❌ Cashfree SDK not loaded", { variant: "error" });
    return;
  }

  try {
    const res = await axios.post("http://localhost:4000/api/cashfree/create-order", {
      amount,
      email,
      phoneNumber,
    });

    const paymentSessionId = res.data.payment_session_id;

    const cashfree = new window.Cashfree({ mode: "sandbox" });

    await cashfree.checkout({
      paymentSessionId,
      redirect: true,
    });

  } catch (error) {
    enqueueSnackbar(
      "❌ Payment Failed: " + (error?.response?.data?.error || error.message),
      { variant: "error" }
    );
  }
};