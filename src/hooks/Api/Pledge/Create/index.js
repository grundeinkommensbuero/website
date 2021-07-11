/**
 *  This file holds a hook to create a pledge
 */

import CONFIG from '../../../../../aws-config';
import { useState, useContext } from 'react';
import AuthContext from '../../../../context/Authentication';

export const useCreatePledge = () => {
  // we are calling useState to 1) return the state and 2) pass the setState function
  // to our savePledge function, so we can set the state from there
  const [state, setState] = useState(null);

  //get user id  from global context
  const { userId, token } = useContext(AuthContext);

  return [state, pledge => createPledge(userId, pledge, token, setState)];
};

// Function which calls the aws api to create a new pledge
const createPledge = async (userId, pledge, token, setState) => {
  try {
    setState('saving');

    const data = pledge;

    if (data.signatureCount) {
      data.signatureCount = parseInt(data.signatureCount);
    }

    const request = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${CONFIG.API.INVOKE_URL}/users/${userId}/pledges`,
      request
    );

    if (response.status === 201) {
      setState('saved');
    } else if (response.status === 401) {
      setState('unauthorized');
    } else {
      setState('error');
    }
  } catch (error) {
    console.log('Error while saving pledge', error);
    setState('error');
  }
};
