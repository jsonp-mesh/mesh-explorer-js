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
import MeshModal from '../components/MeshModal';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { getCatalogLink } from 'utils/getCatalogLink';

import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const TransferPage = () => {
  const [catalogLink, setCatalogLink] = useState('');
  const [openMeshModal, setOpenMeshModal] = useState(false);
  const [existingAuthData, setExistingAuthData] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); // Use to store messages like "No records found" or "Error fetching data"

  // State for select fields
  const [selectedType, setSelectedType] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedNetworkId, setSelectedNetworkId] = useState('');

  const ETH_ADDRESS = process.env.NEXT_PUBLIC_ETH_DESTINATION_ADDRESS;
  const router = useRouter();
  const handleTypeChange = (e) => setSelectedType(e.target.value);
  const handleTokenChange = (e) => setSelectedToken(e.target.value);
  const handleNetworkIdChange = (e) => setSelectedNetworkId(e.target.value);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await fetch(`/api/integrations`);

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        const data = await response.json();

        if (data.content.integrations.length === 0) {
          setErrorMessage('No records found.');
        } else {
          setNetworks(data.content.integrations);
        }
      } catch (error) {
        setErrorMessage('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchNetworks();
  }, []);

  useEffect(() => {
    const authData = localStorage.getItem('authData');
    setExistingAuthData(authData ? JSON.parse(authData) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem('authData', JSON.stringify(existingAuthData));
  }, [existingAuthData]);

  const payload = {
    transferOptions: {
      toAddresses: [
        {
          symbol: selectedToken, // symbol to transfer
          address: ETH_ADDRESS, // address to transfer
          networkId: selectedNetworkId, // network id from /api/v1/transfers/managed/networks request
        },
      ],
    },
  };

  const handleCloseMeshModal = () => {
    setOpenMeshModal(false);
    setLoading(false);
  };

  const handleSuccess = (newAuthData) => {
    const updatedAuthData = [...existingAuthData, newAuthData];
    setExistingAuthData(updatedAuthData);
    localStorage.setItem('authData', JSON.stringify(updatedAuthData));
  };

  const handleTransferFinished = (transferDetails) => {
    alert('Transfer Success!', transferDetails);
    router.push('/');
  };

  const handleExit = (error) => {
    console.log('Broker connection closed:', error);
  };

  const handleClick = async () => {
    setLoading(true);
    await getCatalogLink(
      selectedType,
      setCatalogLink,
      setOpenMeshModal,
      setErrorMessage,
      payload
    );
  };

  return (
    <div>
      <Header getCatalogLink={getCatalogLink} authData={existingAuthData} />
      <h1>Embedded Deposits</h1>

      {!loading ? (
        <form>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Type</InputLabel>
            <Select value={selectedType} onChange={handleTypeChange}>
              {networks.map((integration) => (
                <MenuItem key={integration.type} value={integration.type}>
                  {integration.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedType && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Network</InputLabel>
              <Select
                value={selectedNetworkId}
                onChange={handleNetworkIdChange}
              >
                {networks
                  .find((integration) => integration.type === selectedType)
                  .networks.map((network) => (
                    <MenuItem key={network.id} value={network.id}>
                      {network.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}

          {selectedNetworkId && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Token</InputLabel>
              <Select value={selectedToken} onChange={handleTokenChange}>
                {networks
                  .find((integration) => integration.type === selectedType)
                  .networks.find((network) => network.id === selectedNetworkId)
                  .supportedTokens.map((token) => (
                    <MenuItem key={token} value={token}>
                      {token}
                    </MenuItem>
                  ))}
              </Select>
              {errorMessage ? <p>{errorMessage}</p> : null}
            </FormControl>
          )}

          <Button onClick={handleClick} variant="contained" color="primary">
            Submit
          </Button>
        </form>
      ) : (
        <p>Loading...</p>
      )}

      {openMeshModal ? (
        <MeshModal
          open="true"
          onClose={handleCloseMeshModal}
          link={catalogLink}
          onSuccess={handleSuccess}
          onExit={handleExit}
          transferFinished={handleTransferFinished}
        />
      ) : null}
    </div>
  );
};

export default TransferPage;
