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

export default async function handler(req, res) {
  const { method, body: payload } = req;
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  if (method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const refreshAccount = await fetch(`${MESH_API_URL}/api/v1/token/refresh`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': CLIENT_ID,
        'X-Client-Secret': PROD_API_KEY,
      },
    });

    if (!refreshAccount.ok) {
      const responseBody = await refreshAccount.json();
      const errorMessage = `Failed to Refresh account. Status: ${refreshAccount.status} - ${refreshAccount.statusText}. Message: ${responseBody.message}`;
      throw new Error(errorMessage);
    }

    const response = await refreshAccount.json();
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
