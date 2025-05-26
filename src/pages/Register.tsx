import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import TermsAndConditions from './TermsAndConditions';
import IDVerification from '../components/IDVerification';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  university: string;
  studentId: string;
}

const initialValues: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  university: '',
  studentId: '',
};

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  university: Yup.string().required('University name is required'),
  studentId: Yup.string().required('Student ID is required'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [idSubmitted, setIdSubmitted] = useState(false);

  const steps = ['Personal Information', 'Terms & Conditions', 'ID Verification'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    handleNext();
  };

  const handleIdSubmit = async (file: File) => {
    // TODO: Implement actual file upload logic
    console.log('ID submitted:', file);
    setIdSubmitted(true);
    // In a real application, you would upload the file to your server here
  };

  const handleSubmit = async (values: UserFormData) => {
    // TODO: Implement actual registration logic
    console.log('Form submitted:', values);
    // Navigate to login page after successful registration
    navigate('/login');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="firstName"
                      label="First Name"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="lastName"
                      label="Last Name"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="university"
                      label="University"
                      value={values.university}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.university && Boolean(errors.university)}
                      helperText={touched.university && errors.university}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="studentId"
                      label="Student ID"
                      value={values.studentId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.studentId && Boolean(errors.studentId)}
                      helperText={touched.studentId && errors.studentId}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        );
      case 1:
        return <TermsAndConditions onAccept={handleTermsAccept} />;
      case 2:
        return <IDVerification onSubmit={handleIdSubmit} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Account
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          {activeStep > 0 && (
            <Button onClick={handleBack}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 && idSubmitted && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit(initialValues)}
            >
              Complete Registration
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 