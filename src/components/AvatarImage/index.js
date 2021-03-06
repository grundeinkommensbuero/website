import React, { useState } from 'react';
import * as s from './style.module.less';
import cN from 'classnames';
import avatar1 from './avatar1.svg';
import avatar2 from './avatar2.svg';

const avatarPlaceholders = [avatar1, avatar2];

export default ({ user, className, srcOverwrite, sizes }) => {
  const [placeHolderImage] = useState(() => {
    return avatarPlaceholders[
      Math.round(Math.random() * (avatarPlaceholders.length - 1))
    ];
  });

  const srcset =
    user && user.profilePictures && generateSrcset(user.profilePictures);
  const src =
    user && user.profilePictures && Object.entries(user.profilePictures)[0][1];

  return (
    <img
      className={cN(s.image, className)}
      src={
        srcOverwrite || (user && user.srcOverwrite) || src || placeHolderImage
      }
      srcSet={srcOverwrite || (user && user.srcOverwrite) ? null : srcset}
      alt={user && user.name && `Avatarbild von ${user.name}`}
      sizes={sizes}
    />
  );
};

const generateSrcset = images => {
  return Object.entries(images)
    .filter(([width]) => {
      return !isNaN(parseInt(width));
    })
    .map(([width, file]) => {
      return `${file} ${width}w`;
    })
    .join(', ');
};
