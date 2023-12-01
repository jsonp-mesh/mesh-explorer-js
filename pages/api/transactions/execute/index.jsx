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

import { FrontApi } from '@front-finance/api';

export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;
  const authToken = req.headers['authtoken'];

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const api = new FrontApi({
    baseURL: MESH_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': CLIENT_ID,
      'X-Client-Secret': PROD_API_KEY,
    },
  });

  const getOrderType = (typeString) => {
    if (typeString && typeString.endsWith('Type')) {
      return typeString.slice(0, -4);
    }
    return typeString;
  };

  let payload = {
    authToken: authToken,
    type: req.query.brokerType,
    symbol: req.query.symbol,
    paymentSymbol: req.query.paymentSymbol,
    isCryptoCurrency: req.query.isCryptoCurrency === 'true',
    orderType: getOrderType(req.query.orderType),
    timeInForce: req.query.timeInForce,
  };

  if (req.query.amountIsInPaymentSymbol === 'true') {
    payload.amountInPaymentSymbol = parseFloat(req.query.amount);
    payload.amountIsInPaymentSymbol = true;
  } else if (payload.type === 'coinbase') {
    payload.amountInPaymentSymbol = parseFloat(req.query.amount);
    payload.amountIsInPaymentSymbol = true;
  } else {
    payload.amount = parseFloat(req.query.amount);
    payload.amountIsInPaymentSymbol = false;
  }

  if (req.query.price && req.query.price.trim() !== '') {
    payload = { ...payload, price: parseFloat(req.query.price) };
  }

  if (req.query.price && req.query.price.trim() !== '') {
    payload = { ...payload, price: parseFloat(req.query.price) };
  }

  if (req.query.price && !isNaN(parseFloat(req.query.price))) {
    payload.price = parseFloat(req.query.price);
  }
  try {
    const tradeExecution = await api.transactions.v1TransactionsCreate(
      req.query.side,
      payload
    );

    if (tradeExecution.status !== 200) {
      throw new Error(
        `Failed to execute trade: ${JSON.stringify(
          tradeExecution.data.content.errorMessage
        )}`
      );
    }
    return res.status(200).json(tradeExecution.data.content);
  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ error: error.message, details: error.response.data });
    }

    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
}
