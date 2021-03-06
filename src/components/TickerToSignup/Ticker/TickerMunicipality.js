import React, { useContext, useState, useEffect } from 'react';
import cN from 'classnames';
import Reel from 'react-reel';
import * as s from './style.module.less';
import { MunicipalityContext } from '../../../context/Municipality';

import './reelstyle.less';

export const TickerMunicipality = () => {
  const { municipality } = useContext(MunicipalityContext);
  const [peopleCount, setPeopleCount] = useState(0);

  useEffect(() => {
    if (municipality && typeof municipality.signups === 'number') {
      setPeopleCount(municipality.signups);
    }
  }, [municipality]);

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
};

const numberWithDots = num => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

          <div className={s.numbersContainer}>
            <Reel text={numberWithDots(highlight1)} />
          </div>

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

        <div className={cN(s.counterContainer)}>
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
              <div className={s.numbersContainer}>
                <Reel text={numberWithDots(highlight2)} />
              </div>

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
                  s.counterLabelLongText
                )}
              >
                {inBetween2 && <span>{inBetween2} </span>}
                <br />
                <span>{highlight2}.</span>
                <p className={s.inviteHeadline}>Komm dazu.</p>
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

// Needed for lazy loading
export default TickerMunicipality;
