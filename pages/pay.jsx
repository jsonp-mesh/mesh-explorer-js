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


import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import ChooseProvider from 'components/ChooseProvider';
import { getCatalogLink } from 'utils/getCatalogLink';
import MeshModal from '../components/MeshModal';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  TextField,
} from '@mui/material';

const PayPage = () => {
  const router = useRouter();
  const DESTINATION_ADDRESS = process.env.NEXT_PUBLIC_DESTINATION_ADDRESS;

  const [catalogLink, setCatalogLink] = useState('');
  const [openMeshModal, setOpenMeshModal] = useState(false);
  const [existingAuthData, setExistingAuthData] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [brokerType, setBrokerType] = useState('');

  const productInitialState = {
    name: 'Front NFT',
    price: '10 USDC',
    description: 'Exotic Front NFT',
    imageUrl:
      'https://mma.prnewswire.com/media/1334250/Front_Finance_Logo.jpg?p=facebook',
  };

  const [product, setProduct] = useState(productInitialState);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await fetch(`/api/integrations`);
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        const data = await response.json();
        if (data.content.integrations.length === 0) {
          setErrorMessage('No records found.');
        } else {
          setNetworks(data.content.integrations);
        }
      } catch (error) {
        console.error('An error occurred:', error.message);
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

  const handleProductChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    await getCatalogLink(
      brokerType,
      setCatalogLink,
      setOpenMeshModal,
      setErrorMessage,
      {
        transferOptions: {
          toAddresses: [
            {
              symbol: 'USDC',
              address: DESTINATION_ADDRESS,
              networkId: 'e3c7fdd8-b1fc-4e51-85ae-bb276e075611', // polygon network id
            },
            {
              symbol: 'SOL',
              address: 'DVifyLEUVxCAUTdi8rPHX9fmi1tCwv7hciut4BErskZ8', // address to transfer
              networkId: '0291810a-5947-424d-9a59-e88bb33e999d', // polygon network id
            },
          ],
          amountInFiat: 10,
        },
      }
    );
  };

  const handleSuccess = (newAuthData) => {
    const updatedAuthData = [...existingAuthData, newAuthData];
    setExistingAuthData(updatedAuthData);
    localStorage.setItem('authData', JSON.stringify(updatedAuthData));
  };

  const handleTransferFinished = () => {
    alert('Payment Success!');
    router.push('/');
  };

  const handleExit = (error) => {
    console.log('Broker connection closed:', error);
  };

  const handleCloseMeshModal = () => {
    setOpenMeshModal(false);
  };

  const loadingContent = useMemo(() => {
    if (loading) {
      return <p>Loading...</p>;
    }
    if (errorMessage) {
      return <p>{errorMessage}</p>;
    }
    return (
      <form>
        <Card>
          <CardHeader title="Product Details" />
          <div style={{ display: 'flex' }}>
            <CardMedia
              component="img"
              height="140"
              width="140"
              image={product.imageUrl}
              alt={product.name}
            />
            <CardContent>
              <TextField
                disabled
                fullWidth
                label="Product Name"
                variant="outlined"
                name="name"
                value={product.name}
                onChange={handleProductChange}
              />
              <TextField
                disabled
                fullWidth
                label="Price"
                variant="outlined"
                name="price"
                value={product.price}
                onChange={handleProductChange}
                style={{ marginTop: '16px' }}
              />
              <TextField
                disabled
                fullWidth
                label="Description"
                variant="outlined"
                name="description"
                value={product.description}
                onChange={handleProductChange}
                style={{ marginTop: '16px' }}
              />
            </CardContent>
            {errorMessage ? <p>{errorMessage}</p> : null}
          </div>
        </Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '16px',
          }}
        >
          <Button onClick={handleClick} variant="contained" color="primary">
            Buy Now
          </Button>
        </div>
      </form>
    );
  }, [loading, errorMessage, product, handleProductChange, handleClick]);

  return (
    <div>
      <Header />
      <h1>Pay</h1>
      {!brokerType ? (
        <ChooseProvider
          variant="contained"
          color="secondary"
          brokerType={brokerType}
          setBrokerType={setBrokerType}
        />
      ) : (
        loadingContent
      )}
      {openMeshModal && (
        <MeshModal
          open="true"
          onClose={handleCloseMeshModal}
          link={catalogLink}
          onSuccess={handleSuccess}
          onExit={handleExit}
          transferFinished={handleTransferFinished}
        />
      )}
    </div>
  );
};

export default PayPage;
