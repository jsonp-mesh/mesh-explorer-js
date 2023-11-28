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


export const findNetworkId = (data, targetType, targetName) => {
  console.log('findNeetworks function: ', data, targetType, targetName);
  for (const item of data) {
    if (item.type?.toLowerCase() === targetType?.toLowerCase()) {
      for (const network of item.networks) {
        if (network.name.toLowerCase() === targetName?.toLowerCase()) {
          return network.id;
        }
      }
    }
  }
  return null; 
};
