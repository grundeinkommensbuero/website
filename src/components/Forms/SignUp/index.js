import React, { useState, useEffect, useContext } from 'react';
import { Form, Field } from 'react-final-form';
import { validateEmail } from '../../utils';
import { TextInputWrapped } from '../TextInput';
import FormSection from '../FormSection';
import { Checkbox } from '../Checkbox';
import { CTAButtonContainer, CTAButton } from '../../Layout/CTAButton';
import FormWrapper from '../FormWrapper';
import SignUpFeedbackMessage from '../SignUpFeedbackMessage';
import { useSignUp } from '../../../hooks/Authentication';
import { useUpdateUser } from '../../../hooks/Api/Users/Update';
import AuthContext from '../../../context/Authentication';
import { EnterLoginCode } from '../../Login/EnterLoginCode';
// import AuthInfo from '../../AuthInfo';
// import { FinallyMessage } from '../FinallyMessage';
import * as s from './style.module.less';
import { MunicipalityContext } from '../../../context/Municipality';
import { SearchPlaces } from '../SearchPlaces';

// Not needed at the moment
/* const AuthenticatedDialogDefault = () => {
  return (
    <FinallyMessage preventScrolling={true}>
      <p>
        Klasse, du hast dich bereits angemeldet. Wir informieren dich über alles
        Weitere.
      </p>
      <p>
        <AuthInfo />
      </p>
    </FinallyMessage>
  );
}; */

export default ({
  initialValues,
  postSignupAction,
  illustration = 'POINT_LEFT',
  fieldsToRender,
}) => {
  const [signUpState, userExists, signUp, setSignUpState] = useSignUp();
  const [updateUserState, updateUser] = useUpdateUser();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    isAuthenticated,
    userId,
    customUserData: userData,
    updateCustomUserData,
  } = useContext(AuthContext);
  const [formData, setFormData] = useState();

  const { municipality, setMunicipality } = useContext(MunicipalityContext);
  const [municipalityInForm, setMunicipalityInForm] = useState(municipality);

  let prefilledZip;

  if (municipalityInForm?.zipCodes?.length === 1) {
    prefilledZip = municipalityInForm?.zipCodes[0];
  } else if (userData?.zipCode) {
    prefilledZip = userData.zipCode;
  } else {
    prefilledZip = '';
  }

  // After signup process is successful, do post signup
  useEffect(() => {
    if (hasSubmitted && isAuthenticated && userId) {
      if (postSignupAction) {
        postSignupAction();
      }

      // Now set municipality in context
      if (municipalityInForm) {
        setMunicipality(municipalityInForm);
      }

      if (updateUserState === 'updated') {
        updateCustomUserData();
      }
    }
  }, [hasSubmitted, isAuthenticated, userId, updateUserState]);

  useEffect(() => {
    // If user signs in from form and already existed
    if (
      isAuthenticated &&
      hasSubmitted &&
      formData &&
      userId &&
      userExists !== false
    ) {
      updateUser({
        ...formData,
        updatedOnXbge: true,
        ags: municipalityInForm?.ags,
      });
      setSignUpState('signedIn');
    }
    // If user signs out after signing in
    if (!isAuthenticated && signUpState === 'signedIn') {
      setSignUpState(undefined);
    }
  }, [isAuthenticated, hasSubmitted, formData, userId]);

  if (signUpState === 'success') {
    return <EnterLoginCode preventSignIn={true} />;
  }

  // TODO: clean up, most of the stuff is not used here anymore
  // It is also not ideal to show the loading state even though
  // updateUserState is saved, but otherwise the form would be shown
  // again before unmounting
  if (
    signUpState === 'loading' ||
    updateUserState === 'loading' ||
    updateUserState === 'updated'
  ) {
    return (
      <>
        <SignUpFeedbackMessage
          className={s.adjustFinallyMessage}
          state={'loading'}
          trackingId={'sign-up'}
          trackingCategory="SignUp"
        />
      </>
    );
  }

  // Not needed for now since we want to just the sign up form
  // even for signed in users
  // if (isAuthenticated || userId) {
  //   if (showSignedInMessage) {
  //     return <AuthenticatedDialogDefault />;
  //   } else {
  //     return null;
  //   }
  // }

  const handlePlaceSelect = newMunicipality => {
    setMunicipalityInForm(newMunicipality);
  };

  let fields = [
    'email',
    'username',
    'municipality',
    'zipCode',
    'nudgeBox',
    'newsletterConsent',
  ];
  if (fieldsToRender) {
    fields = fieldsToRender;
  }
  const fieldData = {
    email: {
      name: 'email',
      label: 'E-mail',
      description: 'Pflichtfeld',
      placeholder: 'E-Mail',
      type: 'email',
      component: TextInputWrapped,
    },
    username: {
      name: 'username',
      label: 'Vorname',
      placeholder: 'Vorname',
      type: 'text',
      component: TextInputWrapped,
    },
    municipality: {
      name: 'municipality',
      label: 'Ort',
      placeholder: 'Stadt / Gemeinde',
      type: 'text',
      component: SearchPlaces,
      onPlaceSelect: handlePlaceSelect,
      initialPlace: municipality || {},
      isInsideForm: true,
    },
    zipCode: {
      name: 'zipCode',
      label: 'Postleitzahl',
      placeholder: '12345',
      type: 'number',
      component: TextInputWrapped,
    },
    nudgeBox: {
      name: 'nudgeBox',
      label: getNudgeBoxLabel(municipalityInForm),
      type: 'checkbox',
      component: Checkbox,
    },
    newsletterConsent: {
      name: 'newsletterConsent',
      label: 'Haltet mich über die nächsten Schritte auf dem Laufenden.',
      type: 'checkbox',
      component: Checkbox,
    },
  };

  return (
    <>
      <h3>Willkommen bei der Expedition!</h3>
      <br />
      <Form
        onSubmit={e => {
          e.ags = municipalityInForm?.ags;
          if (!e.newsletterConsent) {
            e.newsletterConsent = false;
          }

          // We don't want to send empty strings
          if (e.username === '') {
            delete e.username;
          }

          if (e.zipCode === '') {
            delete e.zipCode;
          }

          setHasSubmitted(true);
          setFormData(e);

          if (!isAuthenticated) {
            signUp(e);
          }
        }}
        initialValues={{
          ...initialValues,
          zipCode: prefilledZip,
          email: (isAuthenticated && userData?.email) || '',
          username: userData?.username || '',
        }}
        validate={values => validate(values, municipalityInForm)}
        keepDirtyOnReinitialize={true}
        render={({ handleSubmit }) => {
          return (
            <FormWrapper>
              <form onSubmit={handleSubmit}>
                <FormSection>
                  {fields.map((field, i) => {
                    return (
                      <Field key={`form-field-${i}`} {...fieldData[field]} />
                    );
                  })}
                </FormSection>

                <CTAButtonContainer>
                  <CTAButton type="submit">Ich bin dabei</CTAButton>
                </CTAButtonContainer>
              </form>
            </FormWrapper>
          );
        }}
      ></Form>
    </>
  );
};

const validate = (values, municipalityInForm) => {
  const errors = {};

  if (values.email && values.email.includes('+')) {
    errors.email = 'Zurzeit unterstützen wir kein + in E-Mails';
  }

  if (values.email && !validateEmail(values.email)) {
    errors.email = 'Wir benötigen eine valide E-Mail Adresse';
  }

  if (!values.email) {
    errors.email = 'Wir benötigen eine valide E-Mail Adresse';
  }

  if (!values.nudgeBox && !values.newsletterConsent) {
    errors.newsletterConsent = 'Bitte bestätige, dass du dabei sein willst';
  }

  if (!municipalityInForm) {
    errors.newsletterConsent = 'Bitte wähle einen Ort aus.';
  }

  // if (!values.zipCode) {
  //   errors.zipCode =
  //     'Wir benötigen deine Postleitzahl, um dich dem korrekten Bundesland zuzuordnen';
  // }

  return errors;
};

// For the existing campaigns we want different labels
const getNudgeBoxLabel = municipality => {
  // Berlin
  if (municipality?.ags === '11000000') {
    return 'Ja, ich will, dass Berlin an dem Modellversuch teilnimmt.';
  }

  // Hamburg
  if (municipality?.ags === '02000000') {
    return 'Ja, ich will, dass Hamburg an dem Modellversuch teilnimmt.';
  }

  // Bremen
  if (municipality?.ags === '04011000') {
    return 'Ja, ich will, dass Bremen an dem Modellversuch teilnimmt.';
  }

  return 'Ja, ich will, dass das Bürgerbegehren startet.';
};
