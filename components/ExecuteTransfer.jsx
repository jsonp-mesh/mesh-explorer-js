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
import {
  Card,
  CardContent,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/system';
import PropTypes from 'prop-types';

const ExecuteTransfer = ({
  brokerAuthData,
  transferDetails,
  formValues,
  setMfaCode,
  mfaRequired,
  mfaCode,
}) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <form>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{ mb: 1, color: theme.palette.secondary.main }}
            >
              Sending From: {brokerAuthData?.accessToken?.brokerType}
            </Typography>

            <TextField
              required
              disabled
              label="From Auth Token"
              value={formValues?.fromAuthToken}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              required
              disabled
              label="Preview ID"
              value={transferDetails?.content.previewResult?.previewId}
            />
          </FormControl>
          {mfaRequired ? (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                required
                label="Please enter your MFA code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
              />
            </FormControl>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
};

ExecuteTransfer.propTypes = {
  brokerAuthData: PropTypes?.object,
  transferDetails: PropTypes?.object,
  formValues: PropTypes?.object,
  errorMessage: PropTypes?.string,
  setMfaCode: PropTypes?.func,
  mfaRequired: PropTypes?.bool,
  mfaCode: PropTypes?.string,
};

export default ExecuteTransfer;
