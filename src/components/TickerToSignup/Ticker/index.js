import React, { useContext, useState, useEffect } from 'react';
import cN from 'classnames';
import Reel from 'react-reel';
import s from './style.module.less';
import { MunicipalityContext } from '../../../context/Municipality';

import './reelstyle.less';

export const Ticker = ({ tickerDescription }) => {
  const { municipality, statsSummary } = useContext(MunicipalityContext);
  const [peopleCount, setPeopleCount] = useState(3592);
  const [municipalityCount, setMunicipalityCount] = useState(43);

  console.log(statsSummary);

  useEffect(() => {
    if (municipality && typeof municipality.signups === 'number') {
      setPeopleCount(municipality.signups);
    } else {
      let numOfUsers = statsSummary?.previous?.users || 0;
      let numOfMunicipalities = statsSummary?.previous?.municipalities || 0;
      setPeopleCount(numOfUsers);
      setMunicipalityCount(numOfMunicipalities);
    }
  }, [municipality, statsSummary]);

  useEffect(() => {
    let firePeopleCounter;
    let fireMunicipalityCounter;

    if (statsSummary && statsSummary.users > statsSummary.previous.users) {
      const peopleRandom = (Math.floor(Math.random() * 9) + 1) * 500;
      firePeopleCounter = setTimeout(() => {
        setPeopleCount(peopleCount + 1);
      }, peopleRandom);
    } else {
      clearTimeout(firePeopleCounter);
    }

    if (statsSummary && statsSummary.municipalities > statsSummary.previous.municipalities) {
      const municipalityRandom = (Math.floor(Math.random() * 2) + 1) * 2500;
      fireMunicipalityCounter = setTimeout(() => {
        setMunicipalityCount(municipalityCount + 1);
      }, municipalityRandom);
    } else {
      clearTimeout(fireMunicipalityCounter);
    }

    return () => {
      clearTimeout(firePeopleCounter);
      clearTimeout(fireMunicipalityCounter);
    };
  });

  if (!municipality) {
    return (
      <TickerDisplay
        prefixText="Schon"
        highlight1={peopleCount}
        inBetween1="Menschen"
        inBetween2="in"
        highlight2={municipalityCount}
        suffixHighlight2="Orten sind dabei."
        tickerDescription={tickerDescription}
      />
    );
  } else {
    return (
      <TickerDisplay
        prefixText="Schon"
        highlight1={peopleCount}
        inBetween1=""
        inBetween2="Menschen holen Grundeinkommen nach"
        highlight2={municipality?.name}
        suffixHighlight2=""
      />
    );
  }
};

const TickerDisplay = ({
  prefixText,
  highlight1,
  inBetween1,
  inBetween2,
  highlight2,
  suffixHighlight2,
  tickerDescription,
}) => {
  return (
    <section className={s.contentContainer}>
      <div className={s.slotMachine}>
        <div className={s.counterContainer}>
          {prefixText && (
            <span
              className={cN(
                s.counterLabelSlotMachine,
                s.counterLabelMarginRight,
                s.bold
              )}
            >
              {prefixText}{' '}
            </span>
          )}
          <Reel text={highlight1.toString()} />

          {inBetween1 && (
            <h2
              className={cN(
                s.counterLabelSlotMachine,
                s.counterLabelMarginLeft
              )}
            >
              {inBetween1}
            </h2>
          )}
        </div>

        <div className={cN(s.counterContainer, s.alignRight)}>
          {typeof highlight2 !== 'string' && (
            <>
              {inBetween2 && (
                <h2
                  className={cN(
                    s.counterLabelSlotMachine,
                    s.counterLabelMarginRight
                  )}
                >
                  {inBetween2}
                </h2>
              )}
              <Reel text={highlight2.toString()} />
              {suffixHighlight2 && (
                <h2
                  className={cN(
                    s.counterLabelSlotMachine,
                    s.counterLabelMarginLeft
                  )}
                >
                  {suffixHighlight2}
                </h2>
              )}
            </>
          )}
          {typeof highlight2 === 'string' && (
            <>
              <h2
                className={cN(
                  s.counterLabelSlotMachine,
                  s.counterLabelMarginRight,
                  s.noMarginTop
                )}
              >
                {inBetween2 && <span>{inBetween2} </span>}
                <span className={s.highlightHeadline}>{highlight2}</span>
                {/* TODO: implement point */}
                {/* {suffixHighlight2 && <span>{suffixHighlight2}</span>} */}
              </h2>
            </>
          )}
        </div>
        {tickerDescription && (
          <p className={s.actionText}>{tickerDescription}</p>
        )}
      </div>
    </section>
  );
};
