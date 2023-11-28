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

  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ error: 'Method not allowed. Please use GET method.' });
  }

  const { userId } = req.query;

  const api = new FrontApi({
    baseURL: MESH_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': CLIENT_ID,
      'X-Client-Secret': PROD_API_KEY,
    },
  });

  try {
    const response = await api.portfolio.v1HoldingsPortfolioList({
      UserId: userId,
    });
    if (response.status !== 200) {
      const errorMessage = `Failed to fetch Portfolio Holdings. Status: ${response.status} - ${response.statusText}. Message: ${response.message}`;
      throw new Error(errorMessage);
    }

    return res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `An internal server error occurred: ${error.message}` });
  }
}
