import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { validateEmail } from '../../utils';
import { usePledgeApi } from '../../../hooks/Api/Pledge';
import { Button } from '../Button';
import { TextInputWrapped, TextInputOneLine } from '../TextInput';
import FormSection from '../FormSection';
import { Checkbox } from '../Checkbox';
import { SignatureCountSlider } from '../SignatureCountSlider';
import { Link } from 'gatsby';
import s from './style.module.less';
import AnimateHeight from 'react-animate-height';
import { FinallyMessage } from '../FinallyMessage';
import cN from 'classnames';
import SocialMediaButtons from '../../SocialMediaButtons';
import CTAButton from '../../Layout/CTAButton';

export default ({ className }) => {
  const [state, savePledge] = usePledgeApi();
  const [isSecondPartOpen, openSecondPart] = useState(false);
  /*
    state (string) can be:
    null (before form is submitted), "saving", "saved", "userExists", "error"
  */

  if (state) {
    let finallyState;
    if (state === 'saved') {
      finallyState = 'success';
    }
    if (state === 'error' || state === 'userExists') {
      finallyState = 'error';
    }
    if (state === 'saving') {
      finallyState = 'progress';
    }
    return (
      <>
        <FinallyMessage state={finallyState} className={className}>
          {state === 'saving' && 'Wird abgeschickt...'}
          {state === 'saved' &&
            'Yay, danke! Du solltest demnächst eine E-Mail von uns bekommen.'}
          {state === 'userExists' && 'Du bist schon im System.'}
          {state === 'error' && (
            <>
              Da ist was schief gegangen. Melde dich bitte bei uns{' '}
              <a href="mailto:support@expedition-grundeinkommen.de">
                support@expedition-grundeinkommen.de
              </a>
              .
            </>
          )}
        </FinallyMessage>
        <SocialMediaButtons message="Folge uns in den sozialen Medien!" />
      </>
    );
  }

  if (!isSecondPartOpen) {
    return (
      <CTAButton
        className={className}
        illustration="POINT_LEFT"
        onClick={() => openSecondPart(true)}
      >
        Ich bin dabei!
      </CTAButton>
    );
  }

  return (
    <Form
      onSubmit={e => {
        const foo = savePledge(e);
        foo.then(e => {
          console.log('finally', e);
        });
      }}
      initialValues={{
        signatureCount: 1,
      }}
      validate={validate}
      render={({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit} className={cN(s.container, className)}>
            <FormSection>
              <Field
                name="signatureCount"
                label="Du kannst du noch weitere Menschen in deinem Umfeld aktivieren? Sag uns, wie viele Unterschriften von anderen  Menschen in Schleswig-Holstein du realistisch einsammeln kannst!"
                component={SignatureCountSlider}
                type="range"
                min={1}
                max={50}
              />
            </FormSection>
            <AnimateHeight height={isSecondPartOpen ? 'auto' : 0}>
              <div>
                <FormSection heading="Wie möchtest du die Expedition unterstützen?">
                  <Field
                    name="wouldPrintAndSendSignatureLists"
                    type="checkbox"
                    label="Ich drucke die Unterschriftenliste aus und schicke sie unterschrieben ans Expeditionsbüro."
                    component={Checkbox}
                  ></Field>
                  <Field
                    name="wouldPutAndCollectSignatureLists"
                    type="checkbox"
                    label="Ich lege Listen aus an Orten wie z. B. beim Bäcker, in Cafés, auf dem Uni-Campus oder beim Sportverein und sammle sie später wieder ein."
                    component={Checkbox}
                  ></Field>
                  <Field
                    name="wouldCollectSignaturesInPublicSpaces"
                    type="checkbox"
                    label="Ich spreche aktiv Passantinnen und Passanten an und sammle Unterschriften vor Ort."
                    component={Checkbox}
                  ></Field>
                  <Field
                    name="wouldDonate"
                    type="checkbox"
                    label="Ich kann mir vorstellen, die Expedition finanziell zu unterstützen."
                    component={Checkbox}
                  ></Field>
                  <Field
                    name="wouldEngageCustom"
                    label="Ich habe eine andere Idee: "
                    component={TextInputOneLine}
                  ></Field>
                </FormSection>

                <FormSection heading="Wer bist du?">
                  <Field
                    name="name"
                    label="Name"
                    placeholder="Max Musterfrau"
                    component={TextInputWrapped}
                  ></Field>
                  <Field
                    name="email"
                    label="E-Mail"
                    description="Pflichtfeld"
                    placeholder="beispiel@blubb.de"
                    component={TextInputWrapped}
                  ></Field>
                  <Field
                    name="zipCode"
                    label="Postleitzahl"
                    placeholder="12345"
                    component={TextInputWrapped}
                  ></Field>
                </FormSection>

                <FormSection>
                  <Field
                    name="newsletterConsent"
                    label={
                      <>
                        Schreibt mir, wenn die Unterschriftslisten da sind, und
                        haltet mich über alle weiteren Kampagnenschritte auf dem
                        Laufenden.
                      </>
                    }
                    type="checkbox"
                    component={Checkbox}
                  ></Field>
                  <Field
                    name="privacyConsent"
                    label={
                      <>
                        Hiermit bestätige ich, dass ich die{' '}
                        <Link to="/datenschutz/">Datenschutzbestimmungen</Link>{' '}
                        gelesen habe.
                      </>
                    }
                    type="checkbox"
                    component={Checkbox}
                  ></Field>
                </FormSection>

                <CTAButton type="submit" illustration="POINT_LEFT">
                  Ich bin dabei!
                </CTAButton>
              </div>
            </AnimateHeight>
          </form>
        );
      }}
    ></Form>
  );
};

const validate = values => {
  const errors = {};

  if (!values.privacyConsent) {
    errors.privacyConsent = 'Wir benötigen dein Einverständnis';
  }

  if (!validateEmail(values.email)) {
    errors.email = 'Wir benötigen eine valide E-Mail Adresse.';
  }
  return errors;
};
