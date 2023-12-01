import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  TextField,
  Typography,
  Select,
  Grid,
} from '@mui/material';

import { IntegrationsContext } from '../context/integrationsContext';

const GetDepositDetails = ({
  toAuthData,
  symbol,
  setChain,
  chain,
  formValues,
  setSymbol,
}) => {
  const { integrations } = useContext(IntegrationsContext);

  const [chains, setChains] = useState([]);
  const [supportedTokens, setSupportedTokens] = useState([]);

  useEffect(() => {
    const getSupportedTokensByBrokerType = () => {
      const brokerType = toAuthData?.accessToken?.brokerType;
      const matchingIntegrations = integrations.filter(
        (integration) => integration.type === brokerType
      );

      let tokens = [];
      matchingIntegrations.forEach((integration) => {
        integration.networks.forEach((network) => {
          tokens = [...tokens, ...network.supportedTokens];
        });
      });

      const uniqueSupportedTokens = Array.from(new Set(tokens)).sort();
      setSupportedTokens(uniqueSupportedTokens);
    };

    getSupportedTokensByBrokerType();
  }, [toAuthData, integrations]);

  const updateChainsBasedOnSymbol = (selectedSymbol) => {
    const brokerType = toAuthData?.accessToken?.brokerType;
    const relevantIntegrations = integrations.filter(
      (integration) => integration.type === brokerType
    );

    let chainsForSymbol = new Set();
    relevantIntegrations.forEach((integration) => {
      integration.networks.forEach((network) => {
        if (network.supportedTokens.includes(selectedSymbol)) {
          chainsForSymbol.add(network.name);
        }
      });
    });

    setChains([...chainsForSymbol]);
  };

  useEffect(() => {
    if (formValues.symbol) {
      updateChainsBasedOnSymbol(formValues.symbol);
    }
  }, [formValues.symbol, integrations, toAuthData]);

  const getNetworkNamesBySymbol = (selectedSymbol) => {
    const brokerType = toAuthData?.accessToken?.brokerType; // Get the broker type from toAuthData
    const supportedChains = new Set();

    // Filter integrations first by brokerType
    const relevantIntegrations = integrations.filter(
      (integration) => integration.type === brokerType
    );

    // Now filter the networks within those integrations for the selected symbol
    relevantIntegrations.forEach((integration) => {
      integration.networks.forEach((network) => {
        if (network.supportedTokens.includes(selectedSymbol)) {
          supportedChains.add(network.name); // Use the actual network name, not lowercased
        }
      });
    });

    setChains([...supportedChains]);
  };

  useEffect(() => {
    if (symbol) {
      getNetworkNamesBySymbol(symbol);
    }
  }, [symbol, integrations, toAuthData]); // Add toAuthData as a dependency

  return (
    <div>
      <h2>Get {toAuthData?.accessToken?.brokerName} Deposit Address</h2>

      <Card
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mt: 2,
          gap: 2,
          p: 2,
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <form>
            <FormControl fullWidth>
              <Typography variant="h6">Destination</Typography>
              <TextField
                required
                id="destination"
                value={
                  toAuthData?.accessToken?.brokerName || 'No destination found'
                }
                helperText="Where the funds will be sent to"
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="h6">Symbol</Typography>
              <Select
                required
                labelId="symbol-label"
                id="symbol"
                value={symbol}
                label="Symbol"
                onChange={(e) => setSymbol(e.target.value)}
              >
                {supportedTokens.map((supportedTokens, index) => (
                  <MenuItem key={index} value={supportedTokens}>
                    {supportedTokens}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {chains.length ? (
              <FormControl fullWidth>
                <Typography variant="h6">Chain</Typography>
                <Select
                  required
                  id="chain"
                  value={chain}
                  onChange={(e) => {
                    setChain(e.target.value);
                  }}
                >
                  {chains.map((chainName, index) => (
                    <MenuItem key={index} value={chainName}>
                      {chainName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <Grid container justifyContent="flex-end" mt={2}></Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

GetDepositDetails.propTypes = {
  toAuthData: PropTypes?.object,
  setSymbol: PropTypes?.func,
  symbol: PropTypes?.string,
  setChain: PropTypes?.func,
  chain: PropTypes?.string,
  errorMessage: PropTypes?.string,
  setType: PropTypes?.func,
  type: PropTypes?.string,
  handleInputChange: PropTypes?.func,
  formValues: PropTypes?.object,
};

export default GetDepositDetails;
