import React, { useContext } from 'react';
import * as s from './style.module.less';
import { MunicipalityProgress } from '../MunicipalityProgress';
import { MunicipalityContext } from '../../../context/Municipality';
import { useUserMunicipalityState } from '../../../hooks/Municipality/UserMunicipalityState';

export const MunicipalityInfoText = () => {
  const { municipality } = useContext(MunicipalityContext);
  const userMunicipalityState = useUserMunicipalityState();

  // Don't render this component if user has signed up for this municipality or is not signed in
  if (
    userMunicipalityState === 'loggedInThisMunicipalitySignup' ||
    userMunicipalityState === 'loggedOut'
  ) {
    return null;
  }

  if (municipality) {
    return (
      <div className={s.municipalityText}>
        <p className={s.municipalityTextIntro}>
          Gemeinsam starten wir an deinem Wohnort den ersten staatlichen
          Modellversuch zum Grundeinkommen in Deutschland.
        </p>
        <MunicipalityDescription municipality={municipality} />
        <div>
          <MunicipalityProgress
            showHeadline={false}
            showDescription={false}
            isPartOfInfoText={true}
          />
        </div>
        <MunicipalityCTA municipality={municipality} />
      </div>
    );
  } else {
    return <></>;
  }
};

const MunicipalityDescription = ({ municipality }) => {
  if (!municipality) {
    return <></>;
  }

  // Berlin
  if (municipality.ags === '11000000') {
    return (
      <>
        <p>
          Seit September 2019 läuft dafür in Berlin bereits das Volksbegehren.
        </p>
        <p>
          Im November 2020 haben wir die Sammelphase 1 erfolgreich beendet und
          34.468 Unterschriften bei der Senatsverwaltung eingereicht. Wenn das
          Land Berlin die Forderung nicht umsetzt, geht es in die nächste Phase.
        </p>
        <p>
          Sobald Phase 2 beginnt, brauchen wir noch mehr Unterschriften – melde
          dich jetzt an, um zu unterschreiben, sobald es weitergeht!
        </p>
      </>
    );
  }
  // Hamburg
  if (municipality.ags === '02000000') {
    return (
      <>
        <p>
          Seit Februar 2020 läuft deshalb in Hamburg bereits das Volksbegehren.
        </p>
        <p>
          Im März 2020 haben wir die Sammelphase 1 erfolgreich beendet und
          13.421 Unterschriften bei der Senatsverwaltung eingereicht. Wenn das
          Land Hamburg die Forderung nicht umsetzt, geht es in die nächste
          Phase.
        </p>
        <p>
          Sobald Phase 2 beginnt, brauchen wir noch mehr Unterschriften – melde
          dich jetzt an, um zu unterschreiben, sobald es weitergeht!
        </p>
      </>
    );
  }
  // Bremen
  if (municipality.ags === '04011000') {
    return (
      <>
        <p>
          Seit August 2020 läuft dazu bereits unsere Unterschriftensammlung in
          Bremen.
        </p>
        <p>
          Wir brauchen insgesamt 25.000 Unterschriften, damit es zum
          Volksentscheid kommt.
        </p>

        <p>
          Melde dich jetzt an, um den Modellversuch auch in Bremen an den Staat
          zu bringen!
        </p>
      </>
    );
  }

  return (
    <p>
      Wenn sich genug Menschen {municipality ? `in ${municipality.name}` : ''}{' '}
      anmelden, kann der Modellversuch losgehen. Melde dich an, und lade noch
      weitere Menschen ein!
    </p>
  );
};

const MunicipalityCTA = ({ municipality }) => {
  if (!municipality) {
    return <></>;
  }

  // Berlin
  if (municipality.ags === '11000000') {
    return (
      <>
        <p>
          Melde dich an, um Teil der Community zu werden und das Grundeinkommen
          in Berlin voranzubringen!
        </p>
      </>
    );
  }
  // Hamburg
  if (municipality.ags === '02000000') {
    return (
      <>
        <p>
          Melde dich an, um Teil der Community zu werden und das Grundeinkommen
          in Hamburg voranzubringen!
        </p>
      </>
    );
  }
  // Bremen
  if (municipality.ags === '04011000') {
    return (
      <>
        <p>
          Melde dich an, um Teil der Community zu werden und das Grundeinkommen
          in Bremen voranzubringen!
        </p>
      </>
    );
  }

  return (
    <p>
      Melde dich an, um Teil der Community zu werden und das Grundeinkommen nach{' '}
      {municipality ? `${municipality.name} ` : ''} zu bringen!
    </p>
  );
};

// Default export needed for lazy loading
export default MunicipalityInfoText;
