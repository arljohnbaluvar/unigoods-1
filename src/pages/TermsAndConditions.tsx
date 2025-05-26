import React from 'react';
import { Container, Typography, Box, Paper, Checkbox, FormControlLabel, Button } from '@mui/material';

interface TermsAndConditionsProps {
  onAccept?: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onAccept }) => {
  const [accepted, setAccepted] = React.useState(false);

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms and Conditions - UniGoods
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, my: 2 }}>
          <Typography variant="h6" gutterBottom>
            1. User Verification and Safety
          </Typography>
          <Typography paragraph>
            • All users must be current university students or staff members
            • Valid university ID verification is required for account activation
            • Users must upload a clear photo of their university ID for verification
            • Admin verification is required before full access is granted
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Trading and Selling Guidelines
          </Typography>
          <Typography paragraph>
            • Only university-related items and educational materials can be traded or sold
            • All items must be accurately described and photographed
            • Prohibited items: illegal materials, dangerous substances, or non-academic items
            • Sellers must disclose any defects or damage
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Platform Rules
          </Typography>
          <Typography paragraph>
            • Users must maintain respectful communication
            • Meet-ups for exchanges should occur in safe, public campus locations
            • Price gouging and unfair trading practices are prohibited
            • The platform is not responsible for physical exchanges between users
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Privacy and Data Protection
          </Typography>
          <Typography paragraph>
            • User ID verification photos will be securely stored and only accessed by admins
            • Personal information will not be shared with third parties
            • Users can request data deletion upon account closure
            • Communication records may be retained for safety purposes
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. Account Suspension
          </Typography>
          <Typography paragraph>
            • Accounts may be suspended for terms violation
            • False ID verification will result in permanent ban
            • Multiple reported incidents will trigger account review
            • Admin decisions regarding accounts are final
          </Typography>
        </Paper>

        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                color="primary"
              />
            }
            label="I have read and agree to the Terms and Conditions"
          />
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!accepted}
              onClick={handleAccept}
              fullWidth
            >
              Accept and Continue
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default TermsAndConditions; 