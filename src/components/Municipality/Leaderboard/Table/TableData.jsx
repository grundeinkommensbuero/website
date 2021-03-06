import React from 'react';
import * as s from '../style.module.less';

export const TableData = ({ slicedMunicipalities }) => {
  return slicedMunicipalities.map(municipality => {
    const { ags, name, signups, percent } = municipality;
    return (
      <tr className={s.tableRow} key={ags}>
        <td>
          <b>{name}</b>
        </td>
        <td>
          <b>{signups}</b>
        </td>
        <td className={s.alignRight}>
          <b>{percent} %</b>
        </td>
      </tr>
    );
  });
};

export const TableDataEvent = ({ slicedMunicipalities }) => {
  return slicedMunicipalities.map(municipality => {
    const { ags, name, percent, grewByPercent } = municipality;
    return (
      <tr className={s.tableRow} key={ags}>
        <td>
          <b>{name}</b>
        </td>
        <td className={s.alignRight}>{percent} %</td>
        <td className={s.alignRight}>
          <span>
            <b>+ {grewByPercent} %</b>
          </span>
        </td>
      </tr>
    );
  });
};
