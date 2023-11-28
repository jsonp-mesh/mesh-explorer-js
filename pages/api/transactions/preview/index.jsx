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

   const payload = {
    authToken: authToken,
    type: req.query.brokerType,
    symbol: req.query.symbol,
    paymentSymbol: req.query.paymentSymbol,
    isCryptoCurrency: true,
    amount: parseFloat(req.query.amount),
    orderType: getOrderType(req.query.orderType),
    timeInForce: req.query.timeInForce,
    price: req.query.price
};

if (req.query.price && req.query.price.trim() !== '') {
    payload.price = parseFloat(req.query.price);
}


  try {
   

    const tradePreview = await api.transactions.v1TransactionsPreviewCreate(
     req.query.side,
      payload
    );

      console.log(tradePreview.status, tradePreview.data.status)

    if (
      tradePreview.status !== 200 ||
      tradePreview.data.status !== 'ok'
    ) {
      throw new Error(
        `Failed to fetch trade Preview: ${JSON.stringify(
          tradePreview.data
        )}`
      );
    }
    return res.status(200).json(tradePreview.data.content);
  } catch (error) {

        const clientErrorMessage = error.response?.data?.content?.errorMessage ||
      error.response?.data?.message ||
      error.message;

    res.status(500).json({
      error: `Something went wrong: ${clientErrorMessage}`,
      details: {
        method: req.method,
        endpoint: req.url,
        status: error.response?.status,
        data: error.response?.data
      }
    });
  }
}
