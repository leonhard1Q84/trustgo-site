export type PaymentMethodType = 'credit_card' | 'apple_pay' | 'google_pay';

export interface PaymentCardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string; // MM/YY
  cvc: string;
  postalCode?: string;
}

export interface CheckoutPaymentIntent {
  intentId: string;
  reservationId: string;
  confirmationCode: string;
  amount: number;
  currency: string;
  status: 'requires_payment' | 'processing' | 'succeeded' | 'failed';
  clientSecret?: string;
}
