import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// Payment method types
type PaymentMethod = 'cash' | 'gcash' | 'paymaya' | 'paypal';

interface PaymentDetails {
  cash: {
    meetupLocation: string;
    preferredTime: string;
  };
  gcash: {
    phoneNumber: string;
    name: string;
  };
  paymaya: {
    phoneNumber: string;
    name: string;
  };
  paypal: {
    email: string;
  };
}

const initialPaymentDetails: PaymentDetails = {
  cash: {
    meetupLocation: '',
    preferredTime: '',
  },
  gcash: {
    phoneNumber: '',
    name: '',
  },
  paymaya: {
    phoneNumber: '',
    name: '',
  },
  paypal: {
    email: '',
  },
};

const steps = ['Review Order', 'Payment Method', 'Payment Details', 'Confirmation'];

const Checkout: React.FC = () => {
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(initialPaymentDetails);
  const [error, setError] = useState<string>('');

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value as PaymentMethod);
    setError('');
  };

  const handlePaymentDetailsChange = (
    method: PaymentMethod,
    field: string,
    value: string
  ) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value,
      },
    }));
  };

  const validatePaymentDetails = () => {
    switch (paymentMethod) {
      case 'cash':
        if (!paymentDetails.cash.meetupLocation || !paymentDetails.cash.preferredTime) {
          setError('Please fill in all cash payment details');
          return false;
        }
        break;
      case 'gcash':
      case 'paymaya':
        const details = paymentDetails[paymentMethod];
        if (!details.phoneNumber || !details.name) {
          setError(`Please fill in all ${paymentMethod} payment details`);
          return false;
        }
        if (!/^09\d{9}$/.test(details.phoneNumber)) {
          setError('Please enter a valid phone number (e.g., 09123456789)');
          return false;
        }
        break;
      case 'paypal':
        if (!paymentDetails.paypal.email) {
          setError('Please enter your PayPal email');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentDetails.paypal.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 2 && !validatePaymentDetails()) {
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleConfirmOrder = () => {
    // TODO: Implement actual order processing
    clearCart();
    navigate('/dashboard', { state: { orderSuccess: true } });
  };

  const renderPaymentDetails = () => {
    switch (paymentMethod) {
      case 'cash':
        return (
          <Box>
            <TextField
              fullWidth
              label="Meetup Location"
              value={paymentDetails.cash.meetupLocation}
              onChange={(e) =>
                handlePaymentDetailsChange('cash', 'meetupLocation', e.target.value)
              }
              margin="normal"
              helperText="Specify a safe, public location within the university"
            />
            <TextField
              fullWidth
              label="Preferred Time"
              type="datetime-local"
              value={paymentDetails.cash.preferredTime}
              onChange={(e) =>
                handlePaymentDetailsChange('cash', 'preferredTime', e.target.value)
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        );

      case 'gcash':
      case 'paymaya':
        return (
          <Box>
            <TextField
              fullWidth
              label="Phone Number"
              value={paymentDetails[paymentMethod].phoneNumber}
              onChange={(e) =>
                handlePaymentDetailsChange(paymentMethod, 'phoneNumber', e.target.value)
              }
              margin="normal"
              placeholder="09123456789"
            />
            <TextField
              fullWidth
              label="Account Name"
              value={paymentDetails[paymentMethod].name}
              onChange={(e) =>
                handlePaymentDetailsChange(paymentMethod, 'name', e.target.value)
              }
              margin="normal"
            />
          </Box>
        );

      case 'paypal':
        return (
          <TextField
            fullWidth
            label="PayPal Email"
            type="email"
            value={paymentDetails.paypal.email}
            onChange={(e) =>
              handlePaymentDetailsChange('paypal', 'email', e.target.value)
            }
            margin="normal"
          />
        );

      default:
        return null;
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Order
            </Typography>
            {items.map((item) => (
              <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.seller ? `Seller: ${item.seller.name}` : 'No seller information'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="subtitle1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Divider sx={{ my: 2 }} />
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">${getTotal().toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label="Cash (Meet-up)"
                />
                <FormControlLabel value="gcash" control={<Radio />} label="GCash" />
                <FormControlLabel
                  value="paymaya"
                  control={<Radio />}
                  label="PayMaya"
                />
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label="PayPal"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter Payment Details
            </Typography>
            {renderPaymentDetails()}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Confirmation
            </Typography>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your order has been placed successfully!
            </Alert>
            <Typography variant="body1" paragraph>
              Payment Method: {paymentMethod.toUpperCase()}
            </Typography>
            <Typography variant="body1" paragraph>
              Total Amount: ${getTotal().toFixed(2)}
            </Typography>
            <Typography variant="body1">
              Please follow the payment instructions sent to your email to complete
              the transaction.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStep()}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmOrder}
            >
              Complete Order
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Checkout; 