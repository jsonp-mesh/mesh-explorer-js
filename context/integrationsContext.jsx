
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

const defaultState = {};

export const IntegrationsContext = createContext(defaultState);

const IntegrationsProvider = ({ children }) => {
  const [integrations, setIntegrations] = useState([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(false);
  const [message, setMessage] = useState('');

  const getIntegrations = async () => {
    try {
      setLoadingIntegrations(true);
      const response = await fetch('/api/integrations');
      const data = await response.json();

      if (!response.ok) {
        // Throw an error if the server responded with a non-200 status code.
        setMessage(data.error || 'Something went wrong');
        throw new Error(data.error || 'Something went wrong', response.status);
      }
      if (response && data.content.total === 0) {
        setMessage('No Integrations found.');
        setIntegrations([]);
      } else {
        setIntegrations(data.content.integrations);
      }
    } catch (error) {
      setMessage(error);
      console.log('this was the token error', error);
    } finally {
      setLoadingIntegrations(false);
    }
  };

  const state = {
    loadingIntegrations,
    setLoadingIntegrations,
    integrations,
    getIntegrations,
    message,
  };

  return (
    <IntegrationsContext.Provider value={state}>
      {children}
    </IntegrationsContext.Provider>
  );
};

export default IntegrationsProvider;
