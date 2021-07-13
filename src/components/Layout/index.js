import React, { useState, useContext, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import * as s from './style.module.less';
import '../style/base.less';
import { ContentfulSection } from './Sections';
import { RenderPage } from './Sections/RenderPage';
import { Helmet } from 'react-helmet-async';
import { useStaticQuery, graphql } from 'gatsby';
import { Overlay } from '../Overlay';
import { OnboardingOverlay } from '../Overlay/OverlayOnboarding';
import { StickyBannerContext } from '../../context/StickyBanner';
import AuthContext from '../../context/Authentication';
import { buildVisualisationsWithCrowdfunding } from '../../hooks/Api/Crowdfunding';
// import cN from 'classnames';

function Template({ children, sections, pageContext, title, description }) {
  const { contentfulGlobalStuff: globalStuff } = useStaticQuery(graphql`
    query SiteTitleQuery {
      contentfulGlobalStuff(contentful_id: { eq: "3mMymrVLEHYrPI9b6wgBzg" }) {
        siteTitle
        siteDescription {
          siteDescription
        }
        ogimage {
          fixed(width: 1000) {
            src
          }
        }
        footerText
        footerMenu {
          slug
          title
        }
        mainMenu {
          ... on Node {
            ... on ContentfulStaticContent {
              __typename
              slug
              title
              shortTitle
            }
            ... on ContentfulMenuOberpunkt {
              __typename
              title
              internalLink
              externalLink
              contentfulchildren {
                title
                slug
                shortTitle
              }
            }
          }
        }
        overlayActive
        overlayDelay
        overlay {
          ... on Node {
            ... on ContentfulPageSectionOneColumn {
              __typename
              title
              titleShort
              campainVisualisations {
                campainCode
                goal
                startDate
                title
                minimum
                maximum
                addToSignatureCount
                ctaLink
                eyeCatcher {
                  raw
                }
                goalUnbuffered
                goalInbetweenMultiple
                startnextId
                hint {
                  hint
                }
              }
              body {
                raw
                references {
                  ... on ContentfulAsset {
                    # __typename and contentful_id are required to resolve the references
                    __typename
                    contentful_id
                    gatsbyImageData(
                      width: 400
                      layout: CONSTRAINED
                      quality: 90
                    )
                  }
                  ... on ContentfulStaticContent {
                    # __typename and contentful_id are required to resolve the references
                    __typename
                    contentful_id
                    slug
                  }
                  ... on ContentfulPageSectionWithComponents {
                    __typename
                    contentful_id
                    id
                    titleShort
                  }
                }
              }
              callToActionLink
              callToActionText
              colorScheme
              bodyTextSizeHuge
              signUpForm
              emailSignup
              pledgeId
              signaturesId
              disableRequestListsByMail
              callToActionReference {
                slug
                title
                shortTitle
              }
              teamMembers {
                image {
                  gatsbyImageData(width: 200, layout: CONSTRAINED, quality: 80)
                }
                name
                twitter
                linkedin
                website
                role
              }
              twitterFeed
              backgroundIllustration
              socialMediaButtons
              blogTeaser
              questionUbi
              bodyAtTheEnd {
                raw
              }
            }
          }
        }
      }
    }
  `);

  // Return list of visualisation definitions with project field for the startnext project data
  const visualisationsWithCrowdfunding = buildVisualisationsWithCrowdfunding(
    globalStuff?.overlay?.campainVisualisations
  );

  // Create new overlay definition
  const overlayDefninitionWithCrowdfunding = {
    ...globalStuff.overlay,
    campainVisualisations: visualisationsWithCrowdfunding,
  };

  const { stickyBannerVisible, setCurrentURL } = useContext(
    StickyBannerContext
  );
  // update current URL in banner context, to check for pages where banner shoud not appear
  // context itself does not reload on route change, so we set it from layout component
  useEffect(() => {
    setCurrentURL(
      typeof window !== 'undefined' ? window.location.pathname : ''
    );
  });

  // NOTE: not needed until banner is activated again
  // const variableMarginClass = () => {
  //   return stickyBannerVisible ? 'withStickyBanner' : 'withoutStickyBanner';
  // };

  const checkUrlProtocolIdentifier = url => {
    if (typeof url === 'string' && !url.includes('https://')) {
      const updatedUrl = `https:${url}`;
      return updatedUrl;
    }
    return url;
  };

  // Modify section color scheme, when none is set from contentful
  // keyVisual component excluded, because its already violet
  const addColorScheme = sections => {
    if (sections && sections.length !== 0) {
      const colorSchemes = ['white', 'violet', 'aqua'];
      let counter = 0;
      const modSections = [...sections];
      for (let i = 0; i < modSections.length; i++) {
        if (modSections[i] && !modSections[i].colorScheme) {
          modSections[i].colorScheme = colorSchemes[counter];
        }
        counter++;
        if (counter === 3 || modSections[i].keyVisual) {
          counter = 0;
        }
      }
      return modSections;
    }
    return undefined;
  };
  const sectionsWithColorScheme = addColorScheme(sections);

  // Adds additional menu items for users municipality, default max: 5
  const { customUserData, isAuthenticated } = useContext(AuthContext);
  const [modifiedMainMenu, setModifiedMainMenu] = useState(
    globalStuff.mainMenu
  );

  // Updates the Menu when userData is loaded
  useEffect(() => {
    const municipalityMenuItems = createMunicipalityMenuItems();
    const modifiedMenu = mergeIntoMenu(municipalityMenuItems);
    return setModifiedMainMenu(modifiedMenu);
  }, [customUserData, isAuthenticated]);

  // Helpers
  const createMunicipalityMenuItems = (num = 5) => {
    let sortedMunicipalities = [];
    const menuItems = [];
    // After logout the customuserData gets populated again,
    // so we check for isAuthenticated here too
    if (customUserData.municipalities && isAuthenticated) {
      sortedMunicipalities = customUserData.municipalities.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      sortedMunicipalities.slice(0, num).forEach(item => {
        menuItems.push({
          title: `Mein Ort: ${item.name}`,
          slug: `gemeinden/${item.slug}`,
          shortTitle: null,
        });
      });
    } else {
      menuItems.push({
        title: 'Mein Ort',
        slug: 'registrieren',
        shortTitle: null,
      });
    }
    return menuItems;
  };

  const mergeIntoMenu = municipalityMenuItems => {
    const mainMenu = JSON.parse(JSON.stringify(globalStuff.mainMenu));
    const indexToMod = mainMenu.findIndex(el => el.title === 'Mitmachen');
    const engageMenuEntries = [...mainMenu[indexToMod].contentfulchildren];
    const mergedMenu = municipalityMenuItems.concat(engageMenuEntries);
    mainMenu[indexToMod].contentfulchildren = mergedMenu;
    return mainMenu;
  };

  return (
    <>
      {globalStuff.overlayActive && globalStuff.overlay && (
        <Overlay delay={globalStuff.overlayDelay}>
          <ContentfulSection section={overlayDefninitionWithCrowdfunding} />
        </Overlay>
      )}

      <OnboardingOverlay />

      <Header
        menu={modifiedMainMenu}
        hasOverlay={!!globalStuff?.overlay}
        stickyBannerVisible={stickyBannerVisible}
      />
      <Helmet
        defaultTitle={globalStuff.siteTitle}
        titleTemplate={`${globalStuff.siteTitle} - %s`}
      >
        <meta
          name="description"
          content={globalStuff.siteDescription.siteDescription}
        />
        <meta property="og:title" content={globalStuff.siteTitle} />
        <meta
          property="og:description"
          content={globalStuff.siteDescription.siteDescription}
        />
        <meta
          property="og:image"
          content={checkUrlProtocolIdentifier(globalStuff.ogimage.fixed.src)}
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <html lang="de" />
      </Helmet>
      <main className={s.withoutStickyBanner}>
        {children}
        <RenderPage
          sections={sectionsWithColorScheme}
          pageContext={pageContext}
        />
      </main>
      <Footer
        footerText={globalStuff.footerText}
        footerMenu={globalStuff.footerMenu}
      />
    </>
  );
}

export default Template;
