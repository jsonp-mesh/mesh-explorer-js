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
import { PropTypes } from '@mui/material';

const defaultState = {};

export const TransactionContext = createContext(defaultState);

const TransactionProvider = ({ children }) => {
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [message, setMessage] = useState('');
  const [lastTXNBrokerType, setLastTXNBrokerType] = useState(null);

  const getTransactionsDetails = async (payload, brokerType) => {
    try {
      setLoadingTransactions(true);
      setLastTXNBrokerType(brokerType);
      const response = await fetch(`/api/transactions/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Throw an error if the server responded with a non-200 status code.
        setTransactionDetails([]);
        setMessage(data.error || 'Something went wrong');
        throw new Error(data.error || 'Something went wrong', response.status);
      }
      if (response && data.content.total === 0) {
        setMessage('No records found.');
        setTransactionDetails([]);
      } else {
        setTransactionDetails(data.content.transactions);
      }
    } catch (error) {
      setMessage(error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const state = {
    loadingTransactions,
    setLoadingTransactions,
    lastTXNBrokerType,
    transactionDetails,
    getTransactionsDetails,
    message,
  };

  return (
    <TransactionContext.Provider value={state}>
      {children}
    </TransactionContext.Provider>
  );
};

TransactionProvider.propTypes = {
  children: PropTypes?.node?.isRequired,
};

export default TransactionProvider;
