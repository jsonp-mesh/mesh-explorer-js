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


import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import TransferProvider from 'context/transferContext';
import TransactionProvider from 'context/transactionContext';
import NetworksProvider from 'context/networksContext';
import IntegrationsProvider from 'context/integrationsContext';


// eslint-disable-next-line react/prop-types
export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <NetworksProvider>
        <IntegrationsProvider>
        <TransferProvider>
          <TransactionProvider>
            <Component {...pageProps} />
          </TransactionProvider>
        </TransferProvider>
        </IntegrationsProvider>
      </NetworksProvider>
    </ThemeProvider>
  );
}
