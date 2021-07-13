import React, { useContext } from 'react';
import AuthContext from '../../../context/Authentication';
import { MunicipalityContext } from '../../../context/Municipality';
import { useUserMunicipalityState } from '../../../hooks/Municipality/UserMunicipalityState';
import AvatarImage from '../../AvatarImage';
import { LinkButtonLocal, Button } from '../../Forms/Button';
import { SignUpButton } from '../../TickerToSignup/SignupButton';
import { formatDate } from '../../utils';
import * as s from './style.module.less';
import cN from 'classnames';
import { getReferredUserMessage } from '../utils/referredUserMessage';

export const ProfileTile = ({ children }) => {
  const { userId, customUserData: userData } = useContext(AuthContext);
  const {
    municipality,
    setMunicipality,
    municipalityContentfulState,
  } = useContext(MunicipalityContext);
  const tileData = {
    userId,
    userData,
    municipality,
    children,
    setMunicipality,
  };

  const userMunicipalityState = useUserMunicipalityState();

  if (userMunicipalityState === 'loggedInThisMunicipalitySignup') {
    return <TileLoggedInThisMunicipality {...tileData} />;
  }
  if (
    municipalityContentfulState === 'noMunicipality' &&
    userMunicipalityState === 'loggedInOtherMunicipalitySignup'
  ) {
    return <TileNoMunicipalityLoggedInOtherMunicipality {...tileData} />;
  }
  if (
    userMunicipalityState === 'loggedInNoMunicipalitySignup' &&
    municipalityContentfulState === 'noMunicipality'
  ) {
    return <WelcomeBack {...tileData} />;
  }
  if (
    municipalityContentfulState !== 'noMunicipality' &&
    userMunicipalityState === 'loggedInOtherMunicipalitySignup'
  ) {
    return <TileMunicipalityLoggedInOtherMunicipality {...tileData} />;
  }
  return <></>;
};

const TileLoggedInThisMunicipality = ({ userId, userData, municipality }) => {
  const referredUserMessage = getReferredUserMessage({ userData });

  return (
    <>
      {userData && (
        <div className={cN(s.tileContainer, s.sectionAqua)}>
          <div className={s.avatarAndInfo}>
            <div>
              <AvatarImage user={userData} className={s.avatar} />
            </div>

            <div className={s.info}>
              <h3 className={cN(s.headline, s.centerMobile)}>
                {userData.username}
              </h3>
              <ul className={cN(s.infoText, s.centerMobile)}>
                <li className={s.centerMobile}>{userData.city}</li>
                <li className={s.centerMobile}>
                  Dabei seit dem{' '}
                  {userData.createdAt &&
                    formatDate(new Date(userData.createdAt))}
                </li>
              </ul>
            </div>
            {referredUserMessage ? (
              <div className={s.referredUsersMessage}>
                {referredUserMessage}
              </div>
            ) : null}
          </div>
          <div className={s.flexElement}>
            <h3 className={s.headline}>Hallo {userData.username}!</h3>
            {municipality && (
              <p>
                Du hast dich für {municipality.name} angemeldet. Schön, dass du
                dabei bist!
              </p>
            )}
            <p>Besuche dein Profil, um deine Einstellungen zu ändern.</p>
            <div>
              <LinkButtonLocal to={`/mensch/${userId}`}>
                Zum Profil
              </LinkButtonLocal>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TileNoMunicipalityLoggedInOtherMunicipality = ({
  userId,
  userData,
  setMunicipality,
}) => {
  return (
    <>
      {userData && (
        <div className={cN(s.tileContainer, s.sectionWhite)}>
          <div className={s.flexElement}>
            <h3 className={s.headline}>Hallo {userData.username}! </h3>

            <p>Du bist bereits in folgenden Orten angemeldet:</p>
            <div className={s.municipalityButtonGroup}>
              {userData.municipalities &&
                userData.municipalities.map(municipality => {
                  return (
                    <div key={municipality.ags}>
                      <p className={s.municipalityLabel}>{municipality.name}</p>
                      <Button
                        onClick={() => {
                          setMunicipality(municipality);
                        }}
                      >
                        Zur Seite von {municipality.name}
                      </Button>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={s.avatarAndInfo}>
            <div>
              <AvatarImage user={userData} className={s.avatar} />
            </div>

            <div className={s.info}>
              <h3 className={cN(s.headline, s.centerMobile)}>
                {userData.username}
              </h3>
              <ul className={cN(s.infoText, s.centerMobile)}>
                <li className={s.centerMobile}>{userData.city}</li>
                <li className={s.centerMobile}>
                  Dabei seit dem{' '}
                  {userData.createdAt &&
                    formatDate(new Date(userData.createdAt))}
                </li>
              </ul>
            </div>
            <div>
              <p>Besuche dein Profil, um deine Einstellungen zu ändern.</p>
              <LinkButtonLocal to={`/mensch/${userId}`}>
                Zum Profil
              </LinkButtonLocal>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TileMunicipalityLoggedInOtherMunicipality = ({
  userId,
  userData,
  municipality,
}) => {
  return (
    <>
      {userData && (
        <div className={cN(s.tileContainer, s.sectionWhite)}>
          <div className={s.flexElement}>
            <h3 className={s.headline}>Hallo {userData.username}! </h3>

            <p>Du bist bereits in folgenden Orten angemeldet:</p>
            <div className={s.municipalityButtonGroup}>
              {userData.municipalities &&
                userData.municipalities.map(municipality => {
                  return (
                    <div key={municipality.ags}>
                      <p className={s.municipalityLabel}>{municipality.name}</p>
                    </div>
                  );
                })}
            </div>
            {municipality && (
              <>
                <p>
                  Möchtest du dich auch in {municipality.name} anmelden und auf
                  dem Laufenden gehalten werden?
                </p>
                <p>
                  Du kannst dich jederzeit in deinem Profil wieder abmelden.
                </p>
                <SignUpButton>
                  {`In ${municipality.name} anmelden`}
                </SignUpButton>
              </>
            )}
          </div>
          <div className={s.avatarAndInfo}>
            <div>
              <AvatarImage user={userData} className={s.avatar} />
            </div>

            <div className={s.info}>
              <h3 className={cN(s.headline, s.centerMobile)}>
                {userData.username}
              </h3>
              <ul className={cN(s.infoText, s.centerMobile)}>
                <li className={s.centerMobile}>{userData.city}</li>
                <li className={s.centerMobile}>
                  Dabei seit dem{' '}
                  {userData.createdAt &&
                    formatDate(new Date(userData.createdAt))}
                </li>
              </ul>
            </div>
            <div>
              <p>Besuche dein Profil, um deine Einstellungen zu ändern.</p>
              <LinkButtonLocal to={`/mensch/${userId}`}>
                Zum Profil
              </LinkButtonLocal>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const WelcomeBack = ({ children }) => {
  return (
    <div className={cN(s.tileContainer, s.sectionWhite)}>
      <div>
        <h3>Willkommen zurück!</h3>
        <p>
          Schön, dass du wieder da bist! Wie du siehst, hat sich bei uns einiges{' '}
          verändert! Melde dich für deinen Wohnort an, um mitzuhelfen, das{' '}
          Grundeinkommen bei dir vor Ort voran zu bringen.
        </p>
        <div>{children}</div>
      </div>
    </div>
  );
};

// Default export needed for lazy loading
export default ProfileTile;
