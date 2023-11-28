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


import React, { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { TableFooter, TablePagination } from '@mui/material';
import Paper from '@mui/material/Paper';
import { PropTypes } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function StatusDashboard({ page, setPage }) {
  const [status, setStatus] = useState([]);
  const [showStatusTable, setShowStatusTable] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoadingStatus(true);

        const response = await fetch('/api/status');

        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data = await response.json();

        setStatus(data.content);
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatus();
  }, []);

  if (loadingStatus) {
    return <CircularProgress />;
  }

  const renderTable = (rows, headers) => {
    const rowsPerPage = 20;

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const currentPageStatus = rows.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

    return (
      <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 950 }} aria-label="status table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageStatus.map((status, index) => (
                <TableRow
                  key={status?.type + '-' + index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor:
                      index % 2 ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                  }}
                >
                  <TableCell>
                    {status?.deFiWalletData?.name
                      ? status.deFiWalletData.name
                      : status.type}
                  </TableCell>

                  <TableCell>{status?.isUp ? 'Up' : 'Down'}</TableCell>
                  <TableCell>{status?.supportedProducts.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[]}
                  colSpan={5} // updated colspan to 5 as there are 5 columns now
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <div>
      {!showStatusTable ? (
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '20px' }}
          size="small"
          onClick={() => setShowStatusTable(true)}
        >
          Show Status Table
        </Button>
      ) : (
        renderTable(status, [
          // changed from statuss to status
          'Provider',
          'Status',

          'Supported Products',
        ])
      )}
    </div>
  );
}
StatusDashboard.propTypes = {
  tab: PropTypes?.number,
  showTable: PropTypes?.bool,
  setShowTable: PropTypes?.func,
  message: PropTypes?.string,
  page: PropTypes?.number,
  setPage: PropTypes?.func,
  setLoadingStatus: PropTypes?.func,
};

export default StatusDashboard;
