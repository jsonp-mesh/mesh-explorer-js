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



export const tradingAllowed = (brokerType, tradingType) => {
    switch (brokerType) {
        case 'coinbase':
            if (tradingType === 'crypto') {
                return true
            } else {
               return false
        
            };
    
        case 'binanceInternationalDirect':
             if (tradingType === 'crypto') {
                return true
            } else {
               return false
        
            };

        case 'robinhood':
            if (tradingType === 'crypto') {
                return true
            } else {
               return true
        
            };
        case 'binance':
            if (tradingType === 'crypto') {
                return true
            } else {
               return false
        
            };
        case 'alpaca':
             if (tradingType === 'crypto') {
                return true
            } else {
               return false
        
            };
        case 'public':
             if (tradingType === 'crypto') {
                return true
            } else {
               return false
        
            };
        case 'etoro':
             if (tradingType === 'crypto') {
                return true
            } else {
               return false
        
            };
        case 'alpaca':
            if (tradingType === 'crypto') {
                return true
            } else {
               return false
        
            };
        default:
            if (tradingType === 'crypto') {
                return false
            }
            else {
               return false
        
            };
    }
};