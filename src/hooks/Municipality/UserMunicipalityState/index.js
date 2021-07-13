import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../context/Authentication';
import { MunicipalityContext } from '../../../context/Municipality';

export const useUserMunicipalityState = () => {
  const { customUserData, isAuthenticated } = useContext(AuthContext);

  const { municipality } = useContext(MunicipalityContext);
  const [userMunicipalityState, setUserMunicipalityState] = useState();

  useEffect(() => {
    if (isAuthenticated) {
      if (customUserData?.municipalities?.length) {
        const userAgs = customUserData.municipalities.map(m => m.ags);
        if (municipality?.ags && userAgs.includes(municipality.ags)) {
          setUserMunicipalityState('loggedInThisMunicipalitySignup');
        } else {
          setUserMunicipalityState('loggedInOtherMunicipalitySignup');
        }
      } else {
        setUserMunicipalityState('loggedInNoMunicipalitySignup');
      }
    } else {
      setUserMunicipalityState('loggedOut');
    }
  }, [isAuthenticated, customUserData, municipality]);

  return userMunicipalityState;
};
