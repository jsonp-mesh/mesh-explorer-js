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
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';

import { createFrontConnection } from '@front-finance/link';

const MeshModal = ({
  open,
  onClose,
  link,
  onSuccess,
  onExit,
  transferFinished,
  pageLoaded,
}) => {
  const [frontConnection, setFrontConnection] = useState(null);
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

  useEffect(() => {
    setFrontConnection(
      createFrontConnection({
        clientId: CLIENT_ID,
        onBrokerConnected: (authData) => {
          console.info('FRONT SUCCESS', authData);
          onSuccess(authData);
        },
        onEvent: (event) => {
          console.info('FRONT EVENT', event);
        },

        onExit: (error) => {
          if (error) {
            console.error(`[FRONT ERROR] ${error}`);
          }

          if (onExit) {
            console.info('FRONT EXIT');
            onExit();
          }
        },
        onTransferFinished: (transfer) => {
          console.info('TRANSFER FINISHED', transfer);
          transferFinished(transfer);
        },
      })
    );
  }, []);

  useEffect(() => {
    if (open && frontConnection) {
      frontConnection.openLink(link);
    }

    return () => {
      if (frontConnection) {
        frontConnection.closePopup();
      }
    };
  }, [frontConnection, open, link, pageLoaded]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth></Dialog>
  );
};

MeshModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onExit: PropTypes.func,
  transferFinished: PropTypes.func,
  setPageLoaded: PropTypes.func,
  pageLoaded: PropTypes.bool.isRequired,
};

export default MeshModal;
