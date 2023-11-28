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
import { Card, CardContent, Typography, Grid } from '@mui/material';

import PropTypes from 'prop-types';

const TradeConfirmation = ({ tradeResponse }) => {
  return (
    <div>
      <Card
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mt: 2,
          gap: 2,
          p: 2,
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Trade Confirmation
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>
                <strong>Order ID:</strong> {tradeResponse.orderId}
              </Typography>
              <Typography>
                <strong>Broker:</strong> {tradeResponse.brokerType}
              </Typography>
              {/* <Typography>
                <strong>Action:</strong>{' '}
                {tradeResponse.side.charAt(0).toUpperCase() + tradeResponse.side.slice(1)}
              </Typography> */}
              <Typography>
                <strong>Amount:</strong> {tradeResponse.amount}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Price:</strong> ${tradeResponse.price}
              </Typography>
              <Typography>
                <strong>Value:</strong> ${tradeResponse.value}
              </Typography>
              <Typography>
                <strong>Fee:</strong> ${tradeResponse.fee}
              </Typography>
              {/* <Typography>
                <strong>Date:</strong> {formatDate(tradeResponse.timestamp)}
              </Typography> */}
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Status:</strong> {tradeResponse.status}
              </Typography>
              <Typography>
                <strong>Details:</strong> {tradeResponse.statusDetails}
              </Typography>
              <Typography>
                <strong>Time In Force:</strong> {tradeResponse.timeInForce}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

TradeConfirmation.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tradeResponse: PropTypes.object.isRequired,
};

export default TradeConfirmation;
