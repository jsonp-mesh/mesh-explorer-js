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

import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableCell,
  Dialog,
  DialogContent,
  CircularProgress,
  TableContainer,
  Paper,
  TableRow,
  TableHead,
  TableBody,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { getUserId } from '../utils/UserId';
import PropTypes from 'prop-types';

const PortfolioHoldings = ({ brokerType, existingAuthData }) => {
  const [portfolioHoldings, setPortfolioHoldings] = useState([]);
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(0); // Add state variable to store portfolio value
  const [loadingPortfolioHoldings, setLoadingPortfolioHoldings] =
    useState(true);
  const [linkedAccount, setLinkedAccount] = useState(false);

  const userId = getUserId(brokerType);

  const fetchPortfolioHoldings = async () => {
    try {
      setLoadingPortfolioHoldings(true);
      const response = await fetch(
        `/api/holdings/portfolio?brokerType=${brokerType}&userId=${userId}`
      );

      if (response.ok) {
        const data = await response.json();
        setPortfolioValue(data.content.cryptocurrenciesValue.toFixed(2)); // Set portfolio value
        setPortfolioHoldings(data.content.cryptocurrencyPositions);
      } else {
        console.error('Failed to fetch portfolio holdings');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoadingPortfolioHoldings(false); // Set loading to false once data has been fetched or an error has occurred
    }
  };

  useEffect(() => {
    const selectedAuthData = existingAuthData.find(
      (authData) => authData.accessToken.brokerType === brokerType
    );
    if (selectedAuthData) {
      setLinkedAccount(selectedAuthData.linkedAccount);
    }
  }, [brokerType]);

  const linkAccount = async (selectedAuthData) => {
    try {
      const executeAccountLink = await fetch(
        `/api/holdings/portfolio/get?brokerType=${brokerType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            AuthToken:
              selectedAuthData.accessToken.accountTokens[0].accessToken,
          },
        }
      );

      if (!executeAccountLink.ok) {
        throw new Error(
          `Failed to Link account: ${executeAccountLink.statusText}`
        );
      }

      if (executeAccountLink.ok) {
        selectedAuthData.linkedAccount = true;

        // Update the existingAuthData array
        const updatedAuthData = existingAuthData.map((authData) =>
          authData.accessToken.brokerType === brokerType
            ? selectedAuthData
            : authData
        );

        localStorage.setItem('authData', JSON.stringify(updatedAuthData));
        setLinkedAccount(true);
      }
    } catch (error) {
      console.log('this was the error from Mesh', error);
    }
  };

  const handleOpen = () => {
    const selectedAuthData = existingAuthData.find(
      (authData) => authData.accessToken.brokerType === brokerType
    );
    if (selectedAuthData && !linkedAccount) {
      linkAccount(selectedAuthData);
    }
    fetchPortfolioHoldings();
    setOpenPortfolioModal(true);
  };

  const handleClose = () => {
    setOpenPortfolioModal(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="tertiary"
        style={{ marginTop: '20px' }}
        size="small"
        onClick={handleOpen}
      >
        Portfolio Details
      </Button>
      {openPortfolioModal && (
        <Dialog
          open={openPortfolioModal}
          onClose={handleClose}
          aria-labelledby="portfolio-details-dialog-title"
          maxWidth="md"
        >
          <DialogTitle id="portfolio-details-dialog-title">
            {linkedAccount
              ? `Portfolio Details: ${portfolioValue}`
              : 'Linking your account...'}
          </DialogTitle>

          {!linkedAccount ? (
            <DialogContent>
              <CircularProgress />
            </DialogContent>
          ) : (
            <DialogContent>
              {loadingPortfolioHoldings ? (
                <CircularProgress />
              ) : portfolioHoldings?.length > 0 ? (
                <TableContainer
                  component={Paper}
                  style={{ maxHeight: '400px', overflow: 'auto' }}
                >
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell style={{ fontWeight: 'bold', width: '6%' }}>
                          Symbol
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Market Value
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Percentage
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Last Price
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {portfolioHoldings.map((detail, index) => (
                        <TableRow
                          key={detail.symbol + '-' + index}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell
                            style={{
                              maxWidth: '100px', // Adjust based on your needs
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {detail.symbol}
                          </TableCell>
                          <TableCell>${detail.marketValue}</TableCell>
                          <TableCell>{detail.portfolioPercentage}</TableCell>
                          <TableCell>${detail.lastPrice}</TableCell>
                          <TableCell>{detail.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p>No records found.</p>
                </div>
              )}
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

PortfolioHoldings.propTypes = {
  brokerType: PropTypes?.string.isRequired,
  existingAuthData: PropTypes?.array.isRequired,
};

export default PortfolioHoldings;
