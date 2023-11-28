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

import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Tooltip,
  Typography,
  Grid,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import { TransactionContext } from 'context/transactionContext';

const TransactionDetailsModal = ({ open, onClose, brokerType, authToken }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const {
    transactionDetails,
    getTransactionsDetails,
    loadingTransactions,
    lastTXNBrokerType,
    message,
    setLoadingTransactions,
  } = useContext(TransactionContext);

  useEffect(() => {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const currentTimestampMilliseconds = Date.now();
    const date30DaysBackMilliseconds =
      currentTimestampMilliseconds - 1 * millisecondsInADay;
    const date30DaysBackTimestamp = Math.floor(
      date30DaysBackMilliseconds / 1000
    );
    const payload = {
      authToken: authToken,
      type: brokerType,
      count: 30,
      from: date30DaysBackTimestamp,
    };

    const fetchTransactions = async () => {
      try {
        setLoadingTransactions(true);
        await getTransactionsDetails(payload, brokerType);
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    if (!transactionDetails?.length || lastTXNBrokerType !== brokerType) {
      fetchTransactions();
    }
  }, []);

  const handleOpen = () => {
    setOpenDetails(true);
  };

  const handleClose = () => {
    setOpenDetails(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="transfer-details-dialog-title"
      maxWidth="md" // Ensure the dialog doesn't stretch beyond screen bounds
    >
      <DialogTitle id="transfer-details-dialog-title">
        {brokerType.charAt(0).toUpperCase() + brokerType.slice(1)} Transactions:
      </DialogTitle>
      <DialogContent>
        {loadingTransactions ? (
          <CircularProgress />
        ) : transactionDetails.length > 0 ? (
          <TableContainer
            component={Paper}
            style={{ maxHeight: '400px', overflow: 'auto' }} // Adjusted the max height
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                  {/* Moved ID to the first position */}
                  <TableCell style={{ fontWeight: 'bold', width: '6%' }}>
                    ID
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Symbol</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>
                    View Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionDetails.map((detail, index) => (
                  <TableRow
                    key={detail.id + '-' + index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      style={{
                        maxWidth: '100px', // Adjust based on your needs
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {detail.id}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        detail.createdTimestamp * 1000
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{detail.transactionType}</TableCell>
                    <TableCell>{detail.symbol}</TableCell>
                    <TableCell>
                      <Tooltip title={detail.id} placement="top">
                        <Button onClick={handleOpen}>View Details</Button>
                      </Tooltip>
                      <Dialog
                        open={openDetails}
                        onClose={handleClose}
                        aria-labelledby="detail-dialog-title"
                      >
                        <DialogTitle id="detail-dialog-title" color="primary">
                          Transaction Detail Information:
                        </DialogTitle>
                        <DialogContent>
                          <Grid container spacing={2}>
                            {Object.entries(detail).map(([key, value]) => (
                              <Grid item xs={12} sm={6} key={key}>
                                <Typography
                                  variant="subtitle2"
                                  style={{ fontWeight: 'bold' }}
                                >
                                  {key}:
                                </Typography>
                                <Typography variant="body2">
                                  {value.toString()}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </DialogContent>
                        <DialogActions>
                          {/* Close button for the detailed view */}
                          <Button onClick={handleClose} color="primary">
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p>{message}</p>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TransactionDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  brokerType: PropTypes.string.isRequired,
  authToken: PropTypes.string.isRequired,
};

export default TransactionDetailsModal;
