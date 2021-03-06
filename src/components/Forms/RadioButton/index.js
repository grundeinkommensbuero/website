import React from 'react';
import * as s from './style.module.less';

export const RadioButton = ({ input, label }) => {
  return (
    <label className={s.container}>
      <input {...input} />
      <span className={s.radio}></span>
      {label}
    </label>
  );
};
