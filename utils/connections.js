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


export const disconnect = async (payload = null) => {
  try {
    const disconnect = await fetch('/api/disconnect', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!disconnect.ok) {
      throw new Error(`Failed to Disconnect account: ${disconnect.statusText}`);
    }

    const response = await disconnect.json();
    return response;
  } catch (error) {
    console.log('this was the error from Mesh', error);
  }
};

export const refresh = async (payload = null) => {
  try {
    const refreshToken = await fetch('/api/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!refreshToken.ok) {
      throw new Error(
        `Failed to Disconnect account: ${refreshToken.statusText}`
      );
    }

    const response = await refreshToken.json();
    return response;
  } catch (error) {
    console.log('this was the error from Mesh', error);
  }
};
