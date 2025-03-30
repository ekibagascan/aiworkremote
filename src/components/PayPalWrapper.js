import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalWrapper = ({ children }) => {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalWrapper;
