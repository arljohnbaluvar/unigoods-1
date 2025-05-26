import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import { useTradeContext } from '../context/TradeContext';

// Mock current user ID (replace with actual auth)
const CURRENT_USER_ID = 'user1';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trade-tabpanel-${index}`}
      aria-labelledby={`trade-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const TradeProposals: React.FC = () => {
  const { proposals, updateProposalStatus, getUserProposals } = useTradeContext();
  const [tabValue, setTabValue] = React.useState(0);

  const userProposals = getUserProposals(CURRENT_USER_ID);
  const receivedProposals = userProposals.filter(
    (p) => p.receiverId === CURRENT_USER_ID && p.status === 'pending'
  );
  const sentProposals = userProposals.filter(
    (p) => p.proposerId === CURRENT_USER_ID
  );
  const completedProposals = userProposals.filter(
    (p) => p.status === 'completed'
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAcceptProposal = (proposalId: string) => {
    updateProposalStatus(proposalId, 'accepted');
  };

  const handleRejectProposal = (proposalId: string) => {
    updateProposalStatus(proposalId, 'rejected');
  };

  const renderProposalCard = (proposal: any) => {
    const isReceived = proposal.receiverId === CURRENT_USER_ID;

    return (
      <Card key={proposal.id} sx={{ mb: 2 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {isReceived ? 'Requested Item' : 'Your Item'}
              </Typography>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: 'cover', mr: 2 }}
                  image={proposal.requestedItem.imageUrl}
                  alt={proposal.requestedItem.title}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {proposal.requestedItem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Condition: {proposal.requestedItem.condition}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                {isReceived ? 'Offered Item' : 'Requested Item'}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: 'cover', mr: 2 }}
                  image={proposal.proposedItem.imageUrl}
                  alt={proposal.proposedItem.title}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {proposal.proposedItem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Condition: {proposal.proposedItem.condition}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Grid>

          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Message
              </Typography>
              <Typography variant="body2" paragraph>
                {proposal.message}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status:
                </Typography>
                <Chip
                  label={proposal.status.toUpperCase()}
                  color={
                    proposal.status === 'completed'
                      ? 'success'
                      : proposal.status === 'rejected'
                      ? 'error'
                      : 'primary'
                  }
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>

              {proposal.status === 'pending' && isReceived && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAcceptProposal(proposal.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRejectProposal(proposal.id)}
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Trade Proposals
        </Typography>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label={`Received (${receivedProposals.length})`} />
            <Tab label={`Sent (${sentProposals.length})`} />
            <Tab label={`Completed (${completedProposals.length})`} />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          {receivedProposals.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No received proposals
            </Typography>
          ) : (
            receivedProposals.map(renderProposalCard)
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {sentProposals.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No sent proposals
            </Typography>
          ) : (
            sentProposals.map(renderProposalCard)
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {completedProposals.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No completed trades
            </Typography>
          ) : (
            completedProposals.map(renderProposalCard)
          )}
        </TabPanel>
      </Box>
    </Container>
  );
};

export default TradeProposals; 