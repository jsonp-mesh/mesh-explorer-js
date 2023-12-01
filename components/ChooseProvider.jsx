/**
 * Copyright 2023-present Mesh Connect, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from 'react';
import { getCatalogLink } from 'utils/getCatalogLink';
import PropTypes from 'prop-types';

import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

const ChooseProvider = ({
  setCatalogLink,
  brokerType = 'coinbase',
  setOpenMeshModal,
  setBrokerType,
}) => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [providerType, setProviderType] = useState('CEX');
  const [defiIntegrations, setDefiIntegrations] = useState([]);
  const [integrationId, setIntegrationId] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('Core');

  useEffect(() => {
    const fetchDefiIntegrations = async () => {
      const defiWallets = await fetch(`/api/status`);
      const response = await defiWallets.json();
      const wallet = response.content
        .filter((item) => item.deFiWalletData)
        .sort((a, b) => a.name.localeCompare(b.name)); // Sorting step

      setDefiIntegrations(wallet);
    };
    if (providerType === 'Wallet') {
      fetchDefiIntegrations();
    }
  }, [providerType]);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await fetch(`/api/integrations`);

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        const data = await response.json();

        if (response && response.length === 0) {
          setErrorMessage('No records found.');
        } else {
          setIntegrations(data.content.integrations);
        }
      } catch (error) {
        setErrorMessage('Error fetching data. ', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworks();
  }, []);

  const handleProviderType = (value) => {
    setProviderType(value);
  };

  const handleExchangeType = (value) => {
    setBrokerType(value);
    setIntegrationId('');
  };

  const handleDefiWallet = (selectedValue) => {
    setSelectedWallet(selectedValue);
    setBrokerType('deFiWallet');

    const selectedIntegration = defiIntegrations.find(
      (integration) => integration.name === selectedValue
    );
    setIntegrationId(selectedIntegration.deFiWalletData.id);
  };

  const handleClick = async () => {
    setLoading(true);
    await getCatalogLink(
      brokerType,
      setCatalogLink,
      setOpenMeshModal,
      setErrorMessage,
      null,
      integrationId,
      providerType
    );
    setLoading(false);
  };

  return (
    <div>
      <h1>Connect to your Provider</h1>

      {!loading && integrations.length ? (
        <form>
          <FormControl fullWidth variant="outlined" margin="normal">
            <Box pb={2}>
              <InputLabel>Provider Type</InputLabel>
              <Select
                value={providerType}
                onChange={(e) => handleProviderType(e.target.value)}
                style={{ width: '200px' }}
              >
                <MenuItem value="CEX">CEX</MenuItem>
                <MenuItem value="Wallet">Wallet</MenuItem>
                <MenuItem value="Full Catalogue">Full Catalogue</MenuItem>
              </Select>
            </Box>
          </FormControl>

          {providerType === 'CEX' ? (
            <FormControl fullWidth variant="outlined" margin="normal">
              <Box pb={2}>
                <InputLabel>Choose Exchange</InputLabel>
                <Select
                  value={brokerType}
                  onChange={(e) => handleExchangeType(e.target.value)}
                  style={{ width: '200px' }}
                >
                  {integrations.map((integration) => {
                    if (integration.type !== 'deFiWallet') {
                      return (
                        <MenuItem
                          key={integration.type}
                          value={integration.type}
                        >
                          {integration.type}
                        </MenuItem>
                      );
                    }
                    return null;
                  })}
                </Select>
              </Box>
            </FormControl>
          ) : null}
          {providerType === 'Wallet' ? (
            <FormControl fullWidth variant="outlined" margin="normal">
              <Box pb={2}>
                <InputLabel>Choose Wallet Provider</InputLabel>
                <Select
                  value={selectedWallet}
                  onChange={(e) => handleDefiWallet(e.target.value)}
                  style={{ width: '200px' }}
                >
                  {defiIntegrations.map((integration) => (
                    <MenuItem
                      key={integration.deFiWalletData.name}
                      value={integration.name}
                    >
                      {integration.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </FormControl>
          ) : null}

          <Button variant="contained" color="secondary" onClick={handleClick}>
            Connect to Mesh
          </Button>

          {errorMessage ? <p>{errorMessage}</p> : null}
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

ChooseProvider.propTypes = {
  setCatalogLink: PropTypes?.func,
  brokerType: PropTypes?.string,
  setOpenMeshModal: PropTypes?.func,
  setBrokerType: PropTypes?.func,
  setLinkAnother: PropTypes?.func,
};
export default ChooseProvider;
