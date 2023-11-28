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
import {
  DialogContent,
  Box,
  DialogTitle,
  Dialog,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ConfigurePreviewForm from './ConfigurePreview';
import ExecuteTransfer from './ExecuteTransfer';
import GetDepositDetails from './DepositDetails';
import { useRouter } from 'next/router';
import { PropTypes } from '@mui/material';

const Step1 = ({
  brokerAuthData,
  onStepChange,
  toAuthData,
  loading,
  depositAddress,
  handleGetDepositAddress,
  formValues,
  handleInputChange,
  symbol,
  setSymbol,
  chain,
  errorMessage,
  setChain,
  networkId,
  setNetworkId,
  setType,
}) => {
  return (
    <div>
      {!depositAddress ? (
        <GetDepositDetails
          brokerAuthData={brokerAuthData}
          depositAddress={depositAddress}
          toAuthData={toAuthData}
          onStepChange={onStepChange}
          handleInputChange={handleInputChange}
          symbol={symbol}
          formValues={formValues}
          chain={chain}
          setChain={setChain}
          setSymbol={setSymbol}
          errorMessage={errorMessage}
          networkId={networkId}
          setNetworkId={setNetworkId}
          setType={setType}
        />
      ) : (
        <div>Loading deposit address...</div>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetDepositAddress}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Deposit details'}
        </Button>
      </Box>
    </div>
  );
};

const Step2 = ({
  onStepChange,
  brokerAuthData,
  depositAddress,
  toAuthData,
  setTransferDetails,
  handleExecutePreview,
  handleInputChange,
  loading,
  formValues,
  errorMessage,
  networkId,
  type,
}) => {
  return (
    <div>
      <h2>Preview Transfer</h2>
      {!loading ? (
        <ConfigurePreviewForm
          brokerAuthData={brokerAuthData}
          depositAddress={depositAddress}
          toAuthData={toAuthData}
          onStepChange={onStepChange}
          setTransferDetails={setTransferDetails}
          handleExecutePreview={handleExecutePreview}
          handleInputChange={handleInputChange}
          formValues={formValues}
          errorMessage={errorMessage}
          networkId={networkId}
          type={type}
        />
      ) : (
        <div>Loading preview details...</div>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExecutePreview}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Execute Preview'}
        </Button>
      </Box>
    </div>
  );
};

const Step3 = ({
  transferDetails,
  brokerAuthData,
  depositAddress,
  handleExecuteTransfer,
  loading,
  formValues,
  errorMessage,
  setMfaCode,
  mfaCode,
  mfaRequired,
}) => (
  <div>
    <h2>Submit Transfer</h2>
    {transferDetails ? (
      <ExecuteTransfer
        brokerAuthData={brokerAuthData}
        depositAddress={depositAddress}
        transferDetails={transferDetails}
        formValues={formValues}
        errorMessage={errorMessage}
        setMfaCode={setMfaCode}
        mfaCode={mfaCode}
        mfaRequired={mfaRequired}
      />
    ) : (
      <div>Loading deposit address...</div>
    )}{' '}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleExecuteTransfer}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Execute Transfer'}
      </Button>
    </Box>
  </div>
);

Step1.propTypes = {
  brokerAuthData: PropTypes?.object,
  existingAuthData: PropTypes?.array,
  onStepChange: PropTypes?.func,
  setDepositAddress: PropTypes?.func,
  toAuthData: PropTypes?.object,
  loading: PropTypes?.bool,
  depositAddress: PropTypes?.object,
  formValues: PropTypes?.object,
  handleGetDepositAddress: PropTypes?.func,
  handleInputChange: PropTypes?.func,
  symbol: PropTypes?.string,
  setSymbol: PropTypes?.func,
  chain: PropTypes?.string,
  errorMessage: PropTypes?.string,
  setChain: PropTypes?.func,
  networkId: PropTypes?.string,
  setNetworkId: PropTypes?.func,
  setType: PropTypes?.func,
};

Step2.propTypes = {
  onStepChange: PropTypes?.func,
  brokerAuthData: PropTypes?.object,
  depositAddress: PropTypes?.object,
  toAuthData: PropTypes?.object,
  setTransferDetails: PropTypes?.func,
  handleExecutePreview: PropTypes?.func,
  handleInputChange: PropTypes?.func,
  loading: PropTypes?.bool,
  formValues: PropTypes?.object,
  errorMessage: PropTypes?.string,
  networkId: PropTypes?.string,
  type: PropTypes?.string,
};

Step3.propTypes = {
  brokerAuthData: PropTypes?.object,
  transferDetails: PropTypes?.object,
  formValues: PropTypes?.object,
  errorMessage: PropTypes?.string,
  setMfaCode: PropTypes?.func,
  mfaRequired: PropTypes?.bool,
  mfaCode: PropTypes?.string,
  depositAddress: PropTypes?.object,
  handleExecuteTransfer: PropTypes?.func,
  loading: PropTypes?.bool,
};

const TransferModal = ({ open, onClose, brokerAuthData, existingAuthData }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [depositAddress, setDepositAddress] = useState({});
  const [toAuthData, setToAuthData] = useState(null);
  const [transferDetails, setTransferDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMFAForm, setShowMFAForm] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [validAddress, setValidAddress] = useState(true);
  const [symbol, setSymbol] = useState('ETH');
  const [chain, setChain] = useState('');
  const [type, setType] = useState(
    toAuthData?.accessToken?.brokerType || 'coinbase'
  );
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    fromAuthToken: brokerAuthData?.accessToken?.accountTokens[0]?.accessToken,
    fromType: brokerAuthData?.accessToken?.brokerType,
    toType: type,
    networkId: depositAddress?.networkId,
    symbol,
    toAddress: depositAddress?.address,
    amount: 0.012,
    fiatCurrency: 'USD',
  });

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  useEffect(() => {
    if (existingAuthData.length > 1) {
      const destinationAuthData = existingAuthData.find(
        (authData) =>
          authData.accessToken.brokerType !==
          brokerAuthData.accessToken.brokerType
      );
      if (destinationAuthData) {
        setToAuthData(destinationAuthData);
      } else {
        console.log('No matching object found.');
      }
    } else {
      console.log('only one object');
    }
  }, [existingAuthData, brokerAuthData, toAuthData]);

  const handleGetDepositAddress = async () => {
    setLoading(true);

    const payload = {
      authToken: toAuthData?.accessToken?.accountTokens[0]?.accessToken,
      type: toAuthData?.accessToken?.brokerType,
      symbol,
      chain,
    };

    try {
      const generateAddress = await fetch('/api/transfers/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const response = await generateAddress.json();

      if (!generateAddress.ok) {
        setErrorMessage(response.details.message);
        alert(errorMessage);

        throw new Error(
          `Failed to Generate Address: ${generateAddress.statusText}`
        );
      }

      setDepositAddress(response.content);
      setValidAddress(true);

      handleStepChange(2);
    } catch (error) {
      console.error('An error occurred:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecutePreview = async () => {
    setLoading(true);

    const payload = formValues;

    try {
      const executePreview = await fetch('/api/transfers/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const response = await executePreview.json();

      if (!executePreview.ok) {
        setErrorMessage(response.details.message);
        alert(errorMessage);
        throw new Error(
          `Failed to Execute Preview Address: ${executePreview.statusText}`
        );
      }

      setTransferDetails(response);

      handleStepChange(3);
    } catch (error) {
      console.error('An error occurred:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTransfer = async () => {
    setLoading(true);

    const payload = {
      fromAuthToken: brokerAuthData?.accessToken?.accountTokens[0]?.accessToken,
      fromType: brokerAuthData?.accessToken?.brokerType,
      previewId: transferDetails?.content.previewResult?.previewId,
      mfaCode: mfaCode,
    };

    try {
      const executeTransfer = await fetch('/api/transfers/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const response = await executeTransfer.json();

      if (!executeTransfer.ok) {
        setErrorMessage(response.details.message);
        alert(errorMessage);
      }
      if (response.content.status === 'mfaRequired') {
        setShowMFAForm(true);
      } else {
        alert(
          `Transfer Status: ${response.status}.  Here is your transferId: ${response.content.executeTransferResult.transferId}`
        );
        router.push('/');
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      networkId: depositAddress?.networkId,
      toAddress: depositAddress?.address,
    }));
  }, [depositAddress]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {activeStep === 1 && (
          <Step1
            brokerAuthData={brokerAuthData}
            existingAuthData={existingAuthData}
            onStepChange={() => handleStepChange(2)}
            setDepositAddress={setDepositAddress}
            handleGetDepositAddress={handleGetDepositAddress}
            handleInputChange={handleInputChange}
            setToAuthData={setToAuthData}
            loading={loading}
            toAuthData={toAuthData}
            formValues={formValues}
            symbol={symbol}
            setSymbol={setSymbol}
            chain={chain}
            setChain={setChain}
            setType={setType}
          />
        )}
        {activeStep === 2 && (
          <Step2
            brokerAuthData={brokerAuthData}
            depositAddress={depositAddress}
            toAuthData={toAuthData}
            onStepChange={() => handleStepChange(3)}
            setTransferDetails={setTransferDetails}
            handleExecutePreview={handleExecutePreview}
            formValues={formValues}
            handleInputChange={handleInputChange}
            loading={loading}
            errorMessage={errorMessage}
            type={type}
          />
        )}
        {activeStep === 3 && (
          <Step3
            brokerAuthData={brokerAuthData}
            depositAddress={depositAddress}
            toAuthData={toAuthData}
            transferDetails={transferDetails}
            handleExecuteTransfer={handleExecuteTransfer}
            formValues={formValues}
            loading={loading}
            errorMessage={errorMessage}
            setMfaCode={setMfaCode}
            mfaCode={mfaCode}
            mfaRequired={showMFAForm}
          />
        )}
        {!validAddress && <p> Please enter a valid address</p>}
      </DialogContent>
    </Dialog>
  );
};

TransferModal.propTypes = {
  open: PropTypes?.bool,
  onClose: PropTypes?.func,
  brokerAuthData: PropTypes?.object,
  existingAuthData: PropTypes?.array,
  setDepositAddress: PropTypes?.func,
  toAuthData: PropTypes?.object,
  loading: PropTypes?.bool,
  depositAddress: PropTypes?.object,
  handleGetDepositAddress: PropTypes?.func,
  symbol: PropTypes?.string,
  setSymbol: PropTypes?.func,
  chain: PropTypes?.string,
  errorMessage: PropTypes?.string,
  setChain: PropTypes?.func,
  networkId: PropTypes?.string,
  setNetworkId: PropTypes?.func,
  setType: PropTypes?.func,
};

export default TransferModal;
