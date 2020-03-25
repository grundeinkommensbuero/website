import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import FormWrapper from '../FormWrapper';
import FormSection from '../FormSection';
import { FinallyMessage } from '../FinallyMessage';
import { TextInputWrapped } from '../TextInput';
import { CTAButtonContainer, CTAButton } from '../../Layout/CTAButton';
import s from './style.module.less';
import { useUpdateSignatureListByUser } from '../../../hooks/Api/Signatures/Update';
import { useSignatureCountOfUser } from '../../../hooks/Api/Signatures/Get';
import { validateEmail } from '../../utils';
import { SectionInner, Section } from '../../Layout/Sections';
import querystring from 'query-string';
import { useStaticQuery, graphql } from 'gatsby';
import CampaignVisualisations from '../../CampaignVisualisations';
import VisualCounter from '../../VisualCounter';
import cN from 'classnames';

export default ({ successMessage, campaignCode }) => {
  const [
    state,
    updateSignatureList,
    resetSignatureListState,
  ] = useUpdateSignatureListByUser();
  const [
    signatureCountOfUser,
    getSignatureCountOfUser,
  ] = useSignatureCountOfUser();

  // Updating a list should be possible via list id or user id
  const [listId, setListId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [eMail, setEMail] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const urlParams = querystring.parse(window.location.search);
    // Will be null, if param does not exist
    setListId(urlParams.listId);
    setUserId(urlParams.userId);
  }, []);

  useEffect(() => {
    if (userId || eMail) {
      getSignatureCountOfUser({ userId: userId, email: eMail });
    }
  }, [userId, eMail]);

  const {
    allContentfulKampagnenvisualisierung: { edges: campaignVisualisations },
  } = useStaticQuery(graphql`
    query campaignVisualisations {
      allContentfulKampagnenvisualisierung {
        edges {
          node {
            hint {
              hint
            }
            goal
            goalInbetween
            goalUnbuffered
            minimum
            startDate
            title
            addToSignatureCount
            campainCode
          }
        }
      }
    }
  `);

  const addedSelfScanned = state === 'saved' ? count : 0;

  const campaignVisualisationsMapped = campaignVisualisations
    .map(({ node }) => node)
    .filter(({ campainCode: campaignCodeVisualisation }) => {
      return campaignCodeVisualisation === campaignCode;
    });

  if (signatureCountOfUser && signatureCountOfUser.scannedByUser) {
    campaignVisualisationsMapped[0].addSelfScanned = addedSelfScanned;
  }

  const countSignaturesFormProps = {
    state,
    updateSignatureList,
    listId,
    userId,
    eMail,
    setEMail,
    successMessage,
    setCount,
    campaignCode,
    setListId,
    resetSignatureListState,
  };

  return (
    <>
      {signatureCountOfUser && state !== 'userNotFound' && state !== 'error' ? (
        <Section>
          <div className={s.statisticsOverall}>
            <div className={s.statisticsOverallCountItem}>
              <div className={s.statisticsOverallCount}>
                <VisualCounter
                  end={signatureCountOfUser.scannedByUser + addedSelfScanned}
                />
              </div>
              <div className={s.statisticsOverallLabel}>
                Unterschriften
                <br />
                von dir gemeldet
              </div>
            </div>{' '}
            <div className={s.statisticsOverallCountItem}>
              <div className={s.statisticsOverallCount}>
                <VisualCounter end={signatureCountOfUser.received} />
              </div>
              <div className={s.statisticsOverallLabel}>
                Unterschriften
                <br />
                von dir bei uns
                <br />
                angekommen
              </div>
            </div>
          </div>
          <div className={s.visualisation}>
            <CountSignaturesForm {...countSignaturesFormProps} />
            {campaignVisualisationsMapped.length && (
              <div className={s.campaignVisualisations}>
                <CampaignVisualisations
                  visualisations={campaignVisualisationsMapped}
                />
              </div>
            )}
          </div>
        </Section>
      ) : (
        <Section title="Unterschriften zählen">
          <SectionInner hugeText={true}>
            {!(
              state === 'error' ||
              state === 'userNotFound' ||
              state === 'listNotFound'
            ) && (
              <p>
                Du hast Unterschriften gesammelt? Bitte sag uns, wie viele
                Unterschriften hinzu gekommen sind:
              </p>
            )}
            <CountSignaturesForm {...countSignaturesFormProps} />
          </SectionInner>
        </Section>
      )}
    </>
  );
};

const CountSignaturesForm = ({
  state,
  updateSignatureList,
  listId,
  userId,
  setEMail,
  eMail,
  successMessage,
  setCount,
  campaignCode,
  setListId,
  resetSignatureListState,
}) => {
  const needsEMail = !userId && !eMail;

  if (state === 'saving') {
    return <FinallyMessage state="progress">Speichere...</FinallyMessage>;
  }

  if (state === 'saved') {
    return (
      <FinallyMessage>
        {successMessage}
        <CTAButtonContainer className={s.buttonContainer}>
          <CTAButton
            size="MEDIUM"
            onClick={() => {
              setListId(null);
              resetSignatureListState();
            }}
          >
            Mehr eintragen
          </CTAButton>
        </CTAButtonContainer>
      </FinallyMessage>
    );
  }

  if (
    state === 'error' ||
    state === 'userNotFound' ||
    state === 'listNotFound'
  ) {
    return (
      <FinallyMessage state="error">
        {state === 'userNotFound' && (
          <>
            Wir haben deine E-Mail-Adresse nicht gespeichert. War sie richtig
            geschrieben? Probiere es bitte noch ein Mal. Falls es dann noch
            immer nicht funktioniert, melde dich bitte an oder schreib uns an{' '}
            <a href="mailto:support@expedition-grundeinkommen.de">
              support@expedition-grundeinkommen.de
            </a>
            .
            <CTAButtonContainer
              className={cN(s.buttonContainer, s.buttonContainerMessage)}
            >
              <CTAButton
                size="MEDIUM"
                onClick={() => {
                  setEMail(null);
                  resetSignatureListState();
                }}
              >
                Neuer Versuch
              </CTAButton>
            </CTAButtonContainer>
          </>
        )}
        {state === 'error' && (
          <>
            Da ist was schief gegangen. Melde dich bitte bei{' '}
            <a href="mailto:support@expedition-grundeinkommen.de">
              support@expedition-grundeinkommen.de
            </a>{' '}
            und sende uns folgenden Text: listId={listId}.
          </>
        )}
        {state === 'listNotFound' && (
          <>
            Die Liste mit dem Barcode {listId} konnten wir leider nicht finden.
            Bitte probiere es noch ein Mal.
            <CTAButtonContainer className={s.buttonContainer}>
              <CTAButton
                size="MEDIUM"
                onClick={() => {
                  setListId(null);
                  resetSignatureListState();
                }}
              >
                Neuer Versuch
              </CTAButton>
            </CTAButtonContainer>
          </>
        )}
      </FinallyMessage>
    );
  }

  return (
    <Form
      onSubmit={data => {
        data.campaignCode = campaignCode;

        // We can set both the list id and user id here,
        // because if the param is not set it will just be null
        data.userId = userId;

        if (data.listId) {
          setListId(data.listId);
        } else {
          data.listId = listId;
        }

        if (data.email) {
          setEMail(data.email);
        }
        setCount(parseInt(data.count));
        updateSignatureList(data);
      }}
      validate={values => validate(values, needsEMail, !listId)}
      render={({ handleSubmit }) => {
        return (
          <FinallyMessage>
            <h2 className={s.headingSelfScan}>
              Unterschriften selber eintragen
            </h2>
            <FormWrapper>
              <form onSubmit={handleSubmit}>
                {needsEMail && (
                  <FormSection className={s.formSection}>
                    <Field
                      name="email"
                      label="Bitte gib deine E-Mail-Adresse ein."
                      placeholder="E-Mail"
                      component={TextInputWrapped}
                      type="text"
                      className={s.label}
                    ></Field>
                  </FormSection>
                )}
                <FormSection
                  className={s.formSection}
                  fieldContainerClassName={s.formSectionCombined}
                >
                  <Field
                    name="count"
                    label="Anzahl Unterschriften"
                    placeholder="1"
                    component={TextInputWrapped}
                    type="number"
                    min={1}
                    className={s.label}
                    inputClassName={s.countField}
                  ></Field>
                  {!listId && (
                    <Field
                      name="listId"
                      label="Barcode auf der Unterschriftenliste"
                      placeholder=""
                      component={TextInputWrapped}
                      type="number"
                      min={1}
                      className={s.label}
                      inputClassName={s.listIdField}
                    ></Field>
                  )}
                </FormSection>

                <CTAButtonContainer className={s.buttonContainer}>
                  <CTAButton type="submit" size="MEDIUM">
                    Eintragen
                  </CTAButton>
                </CTAButtonContainer>
              </form>
            </FormWrapper>
          </FinallyMessage>
        );
      }}
    />
  );
};

const validate = (values, needsEMail, needsListId) => {
  const errors = {};

  if (!values.count) {
    errors.count = 'Muss ausgefüllt sein';
  }

  if (needsListId && !values.listId) {
    errors.listId = 'Muss ausgefüllt sein';
  }

  if (values.count && values.count < 0) {
    errors.count = 'Nix, es gibt keine negative Anzahl an Unterschriften!';
  }

  if (needsEMail && !validateEmail(values.email)) {
    errors.email = 'Wir benötigen eine valide E-Mail Adresse';
  }

  return errors;
};
