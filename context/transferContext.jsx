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

import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};

export const TransferContext = createContext(defaultState);

const TransferProvider = ({ children }) => {
  const [transferDetails, setTransferDetails] = useState([]);
  const [loading, setLoadingTransfers] = useState(true);
  const [message, setMessage] = useState('');
  const [lastXFRBrokerType, setLastXFRBrokerType] = useState(null);

  const getTransferDetails = async (payload, brokerType) => {
    try {
      setLoadingTransfers(true);
      setLastXFRBrokerType(brokerType);
      const response = await fetch(`/api/transfers/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setTransferDetails([]);
        setMessage(data.error || 'Something went wrong');
      }
      if (response && data.content.total === 0) {
        setMessage('No records found.');
        setTransferDetails([]);
      } else {
        setTransferDetails(data.content.transfers);
      }
    } catch (error) {
      setMessage(error);
    } finally {
      setLoadingTransfers(false);
    }
  };

  const state = {
    loading,
    setLoadingTransfers,
    transferDetails,
    lastXFRBrokerType,
    getTransferDetails,
    message,
  };

  return (
    <TransferContext.Provider value={state}>
      {children}
    </TransferContext.Provider>
  );
};

TransferProvider.propTypes = {
  children: PropTypes?.node?.isRequired,
};
export default TransferProvider;
