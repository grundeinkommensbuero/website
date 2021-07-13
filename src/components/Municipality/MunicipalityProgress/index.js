import React, { useContext } from 'react';
import { CampainVisualisation } from '../../CampaignVisualisations';
import { MunicipalityContext } from '../../../context/Municipality';

import * as s from './style.module.less';
import { useUserMunicipalityState } from '../../../hooks/Municipality/UserMunicipalityState';

export const MunicipalityProgress = ({
  showHeadline = true,
  showDescription = true,
  isPartOfInfoText,
}) => {
  const { municipality } = useContext(MunicipalityContext);
  const userMunicipalityState = useUserMunicipalityState();

  // Don't render this component if user has not signed up for this municipality
  if (
    !isPartOfInfoText &&
    userMunicipalityState !== 'loggedInThisMunicipalitySignup'
  ) {
    return null;
  }

  const statsReady = municipality?.goal > 0;
  let signups = municipality?.signups;

  if (statsReady && typeof signups === 'number') {
    return (
      <div className={s.municipalityProgressBar}>
        {showHeadline && (
          <h2>
            Gemeinsam bringen wir das Grundeinkommen nach{' '}
            {municipality ? `${municipality.name}` : 'Deutschland'}!
          </h2>
        )}
        <CampainVisualisation
          goal={municipality.goal}
          count={signups}
          // showCTA={visualisations.length !== 1 && visualisation.ctaLink}
          labels={{
            NEEDED: () => <>Benötigte Anmeldungen</>,
            GOAL_INBETWEEN_TOOLTIP: count => (
              <>
                Insgesamt benötigt:
                <br />
                {count} Anmeldungen
              </>
            ),
            GOAL_INBETWEEN: count => <>Nächstes Ziel: {count} Anmeldungen</>,
            CURRENT_COUNT: () => <>Anmeldungen</>,
            CTA: () => <>Mitmachen</>,
          }}
          currency="Anmeldungen"
          startDate={false}
        />
        <h3>{getSignupsLabel(municipality.signups, municipality.goal)}</h3>
        {/* Berlin Hamburg Bremen */}
        {showDescription &&
          municipality &&
          (municipality.ags === '11000000' ||
            municipality.ags === '02000000' ||
            municipality.ags === '04011000') && (
            <p>
              Um den offiziellen Volksbegehrensprozess erfolgreich bis zum
              Volksentscheid zu bringen, müssen wir mindestens{' '}
              {municipality.goal.toLocaleString('de-DE')} Menschen in{' '}
              {municipality.name} werden – und am besten so viele wie möglich!
              Hol also noch Menschen dazu.
            </p>
          )}
        {/* all other municipalities */}
        {showDescription &&
          municipality &&
          !(
            municipality.ags === '11000000' ||
            municipality.ags === '02000000' ||
            municipality.ags === '04011000'
          ) && (
            <p>
              Um den offiziellen Bürgerbegehrensprozess zu starten, brauchen wir
              mindestens {municipality.goal.toLocaleString('de-DE')} Menschen
              aus {municipality.name} – und am besten so viele wie möglich! Hol
              also noch Menschen dazu.
            </p>
          )}
      </div>
    );
  } else if (statsReady) {
    return (
      <div>
        {showHeadline && (
          <h2>
            Gemeinsam bringen wir das Grundeinkommen nach{' '}
            {municipality ? `${municipality.name}` : 'Deutschland'}!
          </h2>
        )}
        {/* <h3>{getSignupsLabel(municipality.signups, municipality.goal)}</h3> */}
        {showDescription &&
          municipality &&
          (municipality.ags === '11000000' ||
            municipality.ags === '02000000' ||
            municipality.ags === '04011000') && (
            <>
              <p>
                Um den offiziellen Volksbegehrensprozess in die zweite,
                entscheidende Runde zu bringen, brauchen wir mindestens{' '}
                {municipality.goal.toLocaleString('de-DE')} Menschen aus{' '}
                {municipality.name} – und am besten so viele wie möglich! Hol
                also noch Menschen dazu.
              </p>
              <p className={s.returnHint}>
                Derzeit scheint unsere Datenbank etwas überlastet und wir können
                dir momentan leider nicht sagen, wieviele Menschen sich schon
                {municipality ? `in ${municipality.name}` : ''} angemeldet
                haben. In einigen Minuten solltest du hier wieder die
                aktuellsten Infos{' '}
                {municipality ? `zu ${municipality.name}` : ''} sehen.
              </p>
            </>
          )}
        {showDescription &&
          municipality &&
          !(
            municipality.ags === '11000000' ||
            municipality.ags === '02000000' ||
            municipality.ags === '04011000'
          ) && (
            <>
              <p>
                Um den offiziellen Bürgerbegehrensprozess zu starten, brauchen
                wir mindestens {municipality.goal.toLocaleString('de-DE')}{' '}
                Menschen aus {municipality.name} – und am besten so viele wie
                möglich! Hol also noch Menschen dazu.
              </p>
              <p className={s.returnHint}>
                Derzeit scheint unsere Datenbank etwas überlastet und wir können
                dir momentan leider nicht sagen, wieviele Menschen sich schon
                {municipality ? `in ${municipality.name}` : ''} angemeldet
                haben. In einigen Minuten solltest du hier wieder die
                aktuellsten Infos{' '}
                {municipality ? `zu ${municipality.name}` : ''} sehen.
              </p>
            </>
          )}
      </div>
    );
  } else {
    return (
      <div>
        {showHeadline && (
          <h2>Gemeinsam bringen wir das Grundeinkommen in deinen Ort!</h2>
        )}
      </div>
    );
  }
};

const getSignupsLabel = (signups, goal) => {
  // if (signups > goal) {
  //   return `Ziel erreicht! Und es sind bereits ${signups -
  //     goal} mehr als die benötigten ${goal} Anmeldungen`;
  // }
  if (signups >= goal) {
    return `${signups.toLocaleString('de-DE')} / ${goal.toLocaleString(
      'de-DE'
    )} Anmeldungen. Juhu!`;
  }
  if (signups > 1) {
    return `${signups.toLocaleString('de-DE')} / ${goal.toLocaleString(
      'de-DE'
    )} Anmeldungen`;
  }
  if (signups === 0) {
    return 'Noch keine Anmeldungen. Melde dich jetzt an und bring das Grundeinkommen auf den Weg!';
  }
};

// Default export needed for lazy loading
export default MunicipalityProgress;
