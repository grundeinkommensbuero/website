import React, { useContext, useEffect, useState, useRef } from 'react';
import { List as Loader } from 'react-content-loader';
import * as s from './style.module.less';
import cN from 'classnames';
import CampaignVisualisations from '../../CampaignVisualisations';
import Maps from '../../Maps';
import { stringToId } from '../../utils';
import MainIllustration from '../../MainIllustration';
import AboutUs from '../../AboutUs';
import { CTAButtonContainer, CTALinkExternal, CTALink } from '../CTAButton';
import TwitterEmbed from '../../TwitterEmbed';
import { GatsbyImage } from 'gatsby-plugin-image';
import Share from '../../SocialMedia/Share';
import BlogTeaser from '../../BlogTeaser';
import Confetti from '../../Confetti';
import { contentfulJsonToHtml } from '../../utils/contentfulJsonToHtml';
// NOTE: this is not needed anymore (or right now), so I commented it out for better performance
// import { MunicipalityIntro } from '../../Municipality/MunicipalityIntro';
// import QuestionUbi from '../../QuestionUbi';
import { useUserMunicipalityContentfulState } from '../../../hooks/Municipality/UserMunicipalityContentfulState';
import {
  getFilteredElementsByContentfulState,
  getComponentFromContentful,
} from '../../utils';
import { TextAndImage } from './TextAndImage';
import { StandardSectionComponent } from './StandardSectionComponent';
import { IntroText } from '../../IntroText';

import { MunicipalityContext } from '../../../context/Municipality';
import AuthContext from '../../../context/Authentication';
import { LinkButton } from '../../Forms/Button';
import loadable from '@loadable/component';

const SignUp = loadable(() => import('../../Forms/SignUp'));
const Pledge = loadable(() => import('../../Forms/Pledge'));
const SignatureListDownload = loadable(() =>
  import('../../Forms/SignatureListDownload')
);
const DonationForm = loadable(() => import('../../Forms/DonationForm'));
const SharingFeature = loadable(() => import('../../Onboarding/Share'));
const YoutubeEmbed = loadable(() => import('../../YoutubeEmbed'));

const Components = {
  TickerToSignup: loadable(() => import('../../TickerToSignup')),
  MunicipalityMap: loadable(() =>
    import('../../Municipality/MunicipalityMapAndSearch')
  ),
  InfoText: loadable(() => import('../../Municipality/MunicipalityInfoText')),
  MunicipalityProgress: loadable(() =>
    import('../../Municipality/MunicipalityProgress')
  ),
  InviteFriends: loadable(() => import('../../InviteFriends')),
  BecomeActive: loadable(() => import('../../BecomeActive')),
  ProfileTile: loadable(() => import('../../Profile/ProfileTile')),
  CollectionMap: loadable(() =>
    import('../../Municipality/MunicipalityCollectionMap')
  ),
  IntroText,
  TextAndImage,
  Standard: StandardSectionComponent,
  Pledge,
};

export default function Sections({ sections, pageContext }) {
  const userContentfulState = useUserMunicipalityContentfulState();

  const {
    municipality,
    municipalityContentfulState,
    berlinHamburgBremenState,
  } = useContext(MunicipalityContext);

  const displayedSections = getFilteredElementsByContentfulState({
    elements: sections,
    municipalityContentfulState,
    userContentfulState,
    berlinHamburgBremenState,
    municipality,
    showByDefault: true,
  });
  if (displayedSections && displayedSections.length) {
    return (
      <SectionWrapper>
        {displayedSections.map((section, index) => {
          return (
            <ContentfulSection
              section={section}
              pageContext={pageContext}
              key={index}
            />
          );
        })}
      </SectionWrapper>
    );
  }
  return null;
}

export function SectionWrapper({ children, className }) {
  return <div className={cN(s.sections, className)}>{children}</div>;
}

export function ContentfulSection({ section, pageContext }) {
  const {
    title,
    titleShort,
    campainVisualisations,
    body,
    signUpForm,
    emailSignup,
    videoLink,
    callToActionLink,
    callToActionText,
    sloganLine1,
    sloganLine2,
    __typename,
    teamMembers,
    colorScheme = 'white',
    bodyTextSizeHuge,
    pledgeId,
    signaturesId,
    disableRequestListsByMail,
    callToActionReference,
    twitterFeed,
    maps,
    backgroundIllustration,
    socialMediaButtons,
    blogTeaser,
    preTitle,
    subTitle,
    backgroundImage,
    // questionUbi,
    bodyAtTheEnd,
    columnIntroText,
    imageTopLeft,
    imageTopRight,
    imageBottomLeft,
    imageBottomRight,
    columnTopLeft,
    columnTopRight,
    columnBottomLeft,
    columnBottomRight,
    introText,
    previewDescription,
    theme,
    headline,
  } = section;

  const id = stringToId(titleShort);
  const isVideoSection = __typename === 'ContentfulPageSectionVideo';
  const isIllustration = __typename === 'ContentfulPageSectionIllustration';
  const isTwoColumns = __typename === 'ContentfulPageSectionTwoColumns'; // Actually four columns
  const isDonationFeature = __typename === 'ContentfulPageSectionDonation';

  const userContentfulState = useUserMunicipalityContentfulState();

  const { municipality, municipalityContentfulState } = useContext(
    MunicipalityContext
  );

  const { userId, customUserData: userData } = useContext(AuthContext);

  const [municipalityToShare, setMunicipalityToShare] = useState();
  const scrollToRef = useRef(null);

  useEffect(() => {
    if (userData.municipalities) {
      setMunicipalityToShare(
        getMostRecentMunicipality(userData.municipalities)
      );
    }
  }, [userData]);

  const getMostRecentMunicipality = municipalities => {
    return municipalities.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
  };

  if (__typename === 'ContentfulPageSectionWithComponents') {
    const filteredComponents = getFilteredElementsByContentfulState({
      elements: section.components,
      municipalityContentfulState,
      userContentfulState,
      municipality,
      showByDefault: false,
    });

    return (
      <>
        {section.keyVisual && (
          <Section className={cN(s.sectionWhite, s.keyVisualSection)}>
            <div className={s.keyVisuallowerBorder}>
              <div className={s.keyVisualWrapper}>
                <div className={s.keyVisualContainer}>
                  <div className={s.keyVisual}>{''}</div>
                </div>
                <div className={s.keyClaim}>
                  <h1>
                    Hol das Grundeinkommen jetzt{' '}
                    {municipality
                      ? `nach ${municipality.name}`
                      : 'in deinen Wohnort'}
                    .
                  </h1>
                  {/* <p>
                  Gemeinsam starten wir den ersten staatlichen Modellversuch, um
                  das Grundeinkommen nach ganz Deutschland zu holen.
                </p> */}
                  <LinkButton href="#ticker">Mehr erfahren</LinkButton>
                </div>
              </div>
            </div>
          </Section>
        )}

        <Section
          jumpToId={id}
          className={cN({
            // [s.sectionConfetti]: backgroundIllustration === 'confetti',
            [s.sectionWhite]: colorScheme === 'white',
            [s.sectionViolet]: colorScheme === 'violet',
            [s.sectionAqua]: colorScheme === 'aqua',
            [s.sectionRed]: colorScheme === 'red',
          })}
        >
          <SectionInner>
            {headline && <h2>{headline.headline}</h2>}
            <div className={s.componentElementContainer}>
              {filteredComponents.map((component, index) => {
                return (
                  <div
                    key={index}
                    className={cN({
                      [s.componentLeft]: component.column === 'left',
                      [s.componentRight]: component.column === 'right',
                      [s.componentCenterWide]:
                        component.column === 'centerWide',
                      [s.componentCenterNarrow]:
                        component.column === 'centerNarrow',
                    })}
                  >
                    {getComponentFromContentful({
                      Components,
                      component,
                    })}
                  </div>
                );
              })}
            </div>
          </SectionInner>
        </Section>
      </>
    );
  }

  // NOTE: this is not needed anymore, so I commented it out for better performance
  // if (__typename === 'ContentfulPageSectionGemeindeIntro') {
  //   return (
  //     <MunicipalityIntro
  //       pageContext={pageContext}
  //       className={s.sectionGemeindeIntro}
  //       title={title}
  //       body={body?.body}
  //     />
  //   );
  // }

  if (__typename === 'ContentfulPageSectionIntro') {
    return (
      <SectionHeader
        backgroundImageSet={backgroundImage && backgroundImage.gatsbyImageData}
        title={title}
        preTitle={preTitle}
        subTitle={subTitle}
      ></SectionHeader>
    );
  }

  if (__typename === 'ContentfulPageSectionShare') {
    return (
      <>
        {userData.municipalities && (
          <Section
            className={cN({
              [s.sectionWhite]: colorScheme === 'white',
              [s.sectionViolet]: colorScheme === 'violet',
              [s.sectionAqua]: colorScheme === 'aqua',
              [s.sectionRed]: colorScheme === 'red',
            })}
          >
            <h2>{title}</h2>
            <div ref={scrollToRef}></div>
            <SectionInner>
              <SharingFeature
                userData={userData}
                userId={userId}
                municipality={municipalityToShare}
                isInOnboarding={false}
                introText={introText ? introText : null}
                previewComponent={
                  previewDescription?.raw
                    ? contentfulJsonToHtml(previewDescription)
                    : null
                }
                scrollToRef={scrollToRef}
                fallback={<Loader />}
              />
              {userData?.municipalities?.length > 1 && (
                <>
                  <br />
                  <p>
                    Du bist für mehrere Gemeinden angemeldet. Wähle die Gemeinde
                    für die du teilen möchtest!
                  </p>
                  <div className={s.municipalityConatainer}>
                    {userData.municipalities
                      .sort((x, y) => {
                        return new Date(x.createdAt) - new Date(y.createdAt);
                      })
                      .reverse()
                      .map(municipality => (
                        <p
                          aria-hidden="true"
                          className={cN(s.chooseMunicipality, {
                            [s.activeMunicipality]:
                              municipality.ags === municipalityToShare?.ags,
                          })}
                          key={municipality.ags}
                          onClick={() => setMunicipalityToShare(municipality)}
                        >
                          {municipality.name}
                        </p>
                      ))}
                  </div>
                </>
              )}
            </SectionInner>
          </Section>
        )}
      </>
    );
  }

  return (
    <Section
      title={title}
      jumpToId={id}
      isVideoSection={isVideoSection}
      afterBodyContent={
        <>
          {isIllustration && <MainIllustration className={s.illustration} />}
          {backgroundIllustration === 'confetti' && <Confetti />}
        </>
      }
      className={cN({
        [s.sectionPledge]: !!pledgeId,
        [s.sectionNewsletter]: !!emailSignup,
        [s.sectionIllustration]: isIllustration,
        [s.sectionVideo]: isVideoSection,
        [s.sectionCrowdCollect]: backgroundIllustration === 'crowd_collect',
        [s.sectionCrowdTravel]: backgroundIllustration === 'crowd_travel',
        [s.sectionCrowdQuestion]: backgroundIllustration === 'crowd_question',
        [s.sectionConfetti]: backgroundIllustration === 'confetti',
        [s.sectionWhite]: colorScheme === 'white',
        [s.sectionViolet]: colorScheme === 'violet',
        [s.sectionAqua]: colorScheme === 'aqua',
        [s.sectionRed]: colorScheme === 'red',
      })}
      // NOTE (felix): isVideoSection was in this before, not sure why
      // Breaks the possibility to add a CTA Button to the video section
      // so I removed it.
      // sectionBodyNoEvents={isIllustration || isVideoSection}
      sectionBodyNoEvents={isIllustration}
    >
      {isIllustration && (
        <Slogan sloganLine1={sloganLine1} sloganLine2={sloganLine2} />
      )}
      {isTwoColumns && (
        <SectionInner>
          <div className={s.columnIntroText}>
            {contentfulJsonToHtml(columnIntroText)}
          </div>
          <TwoColumns className={s.columnWrapper}>
            <section className={s.column}>
              {imageTopLeft && (
                <div>
                  <GatsbyImage
                    image={imageTopLeft.gatsbyImageData}
                    className={s.columnIcon}
                    alt=""
                  />
                </div>
              )}
              {columnTopLeft && (
                <div>{contentfulJsonToHtml(columnTopLeft)}</div>
              )}
            </section>
            <section className={s.column}>
              {imageTopRight && (
                <div>
                  <GatsbyImage
                    image={imageTopRight.gatsbyImageData}
                    className={s.columnIcon}
                    alt=""
                  />
                </div>
              )}
              {columnTopRight && (
                <div>{contentfulJsonToHtml(columnTopRight)}</div>
              )}
            </section>
            <section className={s.column}>
              {imageBottomLeft && (
                <div>
                  <GatsbyImage
                    image={imageBottomLeft.gatsbyImageData}
                    className={s.columnIcon}
                    alt=""
                  />
                </div>
              )}
              {columnBottomLeft && (
                <div>{contentfulJsonToHtml(columnBottomLeft)}</div>
              )}
            </section>
            <section className={s.column}>
              {imageBottomRight && (
                <div>
                  <GatsbyImage
                    image={imageBottomRight.gatsbyImageData}
                    className={s.columnIcon}
                    alt=""
                  />
                </div>
              )}
              {columnBottomRight && (
                <div>{contentfulJsonToHtml(columnBottomRight)}</div>
              )}
            </section>
          </TwoColumns>
        </SectionInner>
      )}
      {isDonationFeature && (
        <SectionInner>
          {introText && <div className={s.donationIntroText}>{introText}</div>}
          <DonationForm theme={theme} fallback={<Loader />}></DonationForm>
        </SectionInner>
      )}
      {(body || pledgeId || signaturesId) && (
        <SectionInner hugeText={bodyTextSizeHuge}>
          {body && body.raw ? contentfulJsonToHtml(body) : body}
          {pledgeId && <Pledge pledgeId={pledgeId} className={s.pledge} />}
          {signaturesId && (
            <SignatureListDownload
              signaturesId={signaturesId}
              disableRequestListsByMail={disableRequestListsByMail}
              className={s.pledge}
            />
          )}
        </SectionInner>
      )}
      {campainVisualisations && (
        <CampaignVisualisations visualisations={campainVisualisations} />
      )}
      {maps && <Maps config={maps} />}
      {signUpForm && (
        <SectionInner>
          <SignUp />
        </SectionInner>
      )}
      {videoLink && <YoutubeEmbed url={videoLink} fallback={<Loader />} />}
      {teamMembers && (
        <SectionInner wide={true}>
          <AboutUs members={teamMembers} />
        </SectionInner>
      )}
      {callToActionReference && (
        <SectionInner>
          <CTAButtonContainer>
            {callToActionReference.map(({ title, shortTitle, slug }, index) => (
              <CTALink key={index} to={`/${slug}/`}>
                {shortTitle || title}
              </CTALink>
            ))}
          </CTAButtonContainer>
        </SectionInner>
      )}
      {blogTeaser && <BlogTeaser />}
      {blogTeaser && callToActionText && callToActionLink && (
        <div className={s.spaceBetweenBlogAndCTA} />
      )}
      {/* {questionUbi && <QuestionUbi mode={questionUbi} />} */}
      {callToActionText && callToActionLink && (
        <SectionInner>
          <CTAButtonContainer>
            <CTALinkExternal href={callToActionLink}>
              {callToActionText}
            </CTALinkExternal>
          </CTAButtonContainer>
        </SectionInner>
      )}
      {twitterFeed && (
        <SectionInner>
          <TwitterEmbed />
        </SectionInner>
      )}
      {socialMediaButtons && (
        <SectionInner>
          <Share />
        </SectionInner>
      )}
      {bodyAtTheEnd && bodyAtTheEnd.raw && (
        <SectionInner hugeText={bodyTextSizeHuge}>
          {contentfulJsonToHtml(bodyAtTheEnd)}
        </SectionInner>
      )}
    </Section>
  );
}

export function Section({
  children,
  className,
  title,
  jumpToId,
  afterBodyContent,
  isHeader,
  sectionBodyNoEvents,
}) {
  return (
    <section
      className={cN(s.section, className, {
        [s.sectionHeader]: isHeader,
      })}
    >
      {jumpToId && (
        <div id={jumpToId} className={s.jumpToAnchor}>
          <div id={jumpToId.toLowerCase()} />
        </div>
      )}
      <div
        className={cN(s.sectionBody, {
          [s.sectionBodyNoEvents]: sectionBodyNoEvents,
        })}
      >
        {title && <h2 className={s.title}>{title}</h2>}
        {children}
      </div>
      {afterBodyContent}
    </section>
  );
}

export function SectionHeader({
  backgroundImageSet,
  className,
  title,
  preTitle,
  subTitle,
  ...other
}) {
  return (
    <Section
      isHeader={true}
      afterBodyContent={
        backgroundImageSet ? (
          <>
            <GatsbyImage
              image={backgroundImageSet}
              className={s.heroImage}
              alt=""
            />
            <div className={s.heroImageOverlay} />
          </>
        ) : (
          <>
            <div className={cN(s.heroImage, s.heroBackground)}>
              <svg width="100%" height="100%">
                <line x1="20" y1="0" x2="30" y2="300" stroke="black" />
                <line x1="00" y1="40" x2="3000" y2="10" stroke="black" />
              </svg>
            </div>
          </>
        )
      }
      className={cN(className, {
        [s.sectionWithHeroImage]: backgroundImageSet,
      })}
      {...other}
    >
      <SectionInner>
        <header className={s.header}>
          <div className={s.headerText}>
            {preTitle && <div className={s.headerPreTitle}>{preTitle}</div>}
            <h2
              className={cN(s.headerTitle, {
                [s.headerTitleLight]: !backgroundImageSet,
              })}
            >
              {title}
            </h2>
            {subTitle && <div className={s.headerSubTitle}>{subTitle}</div>}
          </div>
        </header>
      </SectionInner>
    </Section>
  );
}

export function SectionInner({ children, hugeText, wide, className }) {
  return (
    <div
      className={cN(s.inner, className, {
        [s.innerTextHuge]: hugeText,
        [s.innerWide]: wide,
      })}
    >
      {children}
    </div>
  );
}

// Misnomer: Actually 4 columns, but can't be changed now
export function TwoColumns({ children, className }) {
  return <div className={cN(s.inner, className)}>{children}</div>;
}

function Slogan({ sloganLine1, sloganLine2 }) {
  return (
    <h2 className={s.slogan}>
      <span className={s.sloganLine1}>{sloganLine1}</span>
      <span className={s.sloganLine2}>{sloganLine2}</span>
      {/* <EmailListForm className={s.sloganLineSignup} /> */}
    </h2>
  );
}
