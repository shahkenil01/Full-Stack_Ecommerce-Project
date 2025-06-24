import axios from "axios";

export const handlePayment = async ({ amount, email, phoneNumber, token, enqueueSnackbar }) => {
  if (!window.Cashfree) {
    enqueueSnackbar("❌ Cashfree SDK not loaded", { variant: "error" });
    return;
  }

  try {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cashfree/create-order`, {
      amount,
      email,
      phoneNumber,
      token,
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