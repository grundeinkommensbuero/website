import React, { useEffect, useState } from 'react';
import { SectionInner } from '../../Layout/Sections';
import s from './style.module.less';
import { Speechbubble } from '../Speechbubble';
import AvatarImage from '../../AvatarImage';
import { useGetMostRecentQuestions } from '../../../hooks/Api/Questions';

export default ({ questionJustSent }) => {
  const [, questions, getQuestions] = useGetMostRecentQuestions();

  useEffect(() => {
    getQuestions(6);
  }, []);

  const questionsWithJustSent = questionJustSent
    ? [questionJustSent, ...questions]
    : questions;

  return (
    <SectionInner wide={true}>
      <div className={s.container}>
        {questionsWithJustSent.map((question, index) => {
          return <Question key={index} {...question} />;
        })}
      </div>
    </SectionInner>
  );
};

const Question = ({ user, body }) => {
  let usernameAndCity = user.username;
  if (user.city) {
    usernameAndCity += ` aus ${user.city}`;
  }
  return (
    <article className={s.question}>
      <Speechbubble isSmall={true}>
        <div className={s.questionContent}>{body}</div>
      </Speechbubble>
      <div className={s.belowSpeechBubble}>
        <AvatarImage className={s.avatar} user={user} sizes="40px" />
        <div className={s.name} title={usernameAndCity}>
          {usernameAndCity}{' '}
        </div>
      </div>
    </article>
  );
};
