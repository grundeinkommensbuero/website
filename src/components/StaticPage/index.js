import React, { useContext, useEffect } from 'react';
import { graphql } from 'gatsby';
import Layout from '../Layout';
import { Helmet } from 'react-helmet-async';
import MatomoTrackingStuff from './MatomoTrackingStuff';
import AuthContext from '../../context/Authentication';
import { MunicipalityContext } from '../../context/Municipality';
import { useSEO } from '../../hooks/Municipality/SEO';

const URL = 'https://expedition-grundeinkommen.de';

const staticPage = ({ data, location, pageContext }) => {
  const page = data.contentfulStaticContent;

  const { setPageContext } = useContext(MunicipalityContext);
  useEffect(() => {
    setPageContext(pageContext);
  }, []);

  const { isAuthenticated } = useContext(AuthContext);

  const { title, description } = useSEO(page);

  return (
    <>
      {typeof isAuthenticated !== 'undefined' && (
        <Layout
          location={location}
          title={title}
          sections={page.sections}
          pageContext={pageContext}
          description={description}
        >
          <Helmet>
            <title>{title}</title>

            {page.description && (
              <meta name="description" content={description} />
            )}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={URL + location.pathname} />
            <script type="text/javascript">{MatomoTrackingStuff}</script>
          </Helmet>
        </Layout>
      )}
    </>
  );
};

export default staticPage;

export const pageQuery = graphql`
  query StaticPageBySlug($slug: String!) {
    contentfulStaticContent(slug: { eq: $slug }) {
      title
      description {
        internal {
          content
        }
      }
      sections {
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
              eyeCatcherLink
              goalUnbuffered
              goalInbetweenMultiple
              startnextId
              hint {
                hint
              }
              sys {
                contentType {
                  sys {
                    id
                  }
                }
              }
            }
            body {
              raw
              references {
                ... on ContentfulAsset {
                  # __typename and contentful_id are required to resolve the references
                  __typename
                  contentful_id
                  gatsbyImageData(width: 500, layout: CONSTRAINED, quality: 90)
                  description
                  title
                  file {
                    details {
                      image {
                        height
                        width
                      }
                      size
                    }
                    fileName
                    url
                    contentType
                  }
                }
                ... on ContentfulStaticContent {
                  # __typename and contentful_id are required to resolve the references
                  __typename
                  contentful_id
                  slug
                  sys {
                    contentType {
                      sys {
                        id
                      }
                    }
                  }
                }
                ... on ContentfulPageSectionWithComponents {
                  __typename
                  contentful_id
                  id
                  titleShort
                  sys {
                    contentType {
                      sys {
                        id
                      }
                    }
                  }
                }
                ... on ContentfulPageSectionOneColumn {
                  __typename
                  contentful_id
                  id
                  titleShort
                  sys {
                    contentType {
                      sys {
                        id
                      }
                    }
                  }
                }
                ... on ContentfulCallToActionButton {
                  # __typename and contentful_id are required to resolve the references
                  __typename
                  contentful_id
                  id
                  internalReference {
                    slug
                  }
                  openInNewTab
                  linkLong {
                    linkLong
                  }
                  link
                  jumpTo
                  mailtoSubject
                  mailtoBody {
                    mailtoBody
                  }
                  mailto
                  text
                  copyToClipboard {
                    copyToClipboard
                  }
                  sys {
                    contentType {
                      sys {
                        id
                      }
                    }
                  }
                }
                ... on ContentfulQuestion {
                  # __typename and contentful_id are required to resolve the references
                  __typename
                  contentful_id
                  id
                  question {
                    question
                  }
                  answer {
                    raw
                  }
                }
              }
            }
            maps {
              name
              state
              config {
                maxBounds
                zoom
                center
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
              references {
                ... on ContentfulCallToActionButton {
                  # __typename and contentful_id are required to resolve the references
                  __typename
                  contentful_id
                  id
                  internalReference {
                    slug
                  }
                  openInNewTab
                  linkLong {
                    linkLong
                  }
                  link
                  jumpTo
                  mailtoSubject
                  mailtoBody {
                    mailtoBody
                  }
                  mailto
                  text
                  copyToClipboard {
                    copyToClipboard
                  }
                  sys {
                    contentType {
                      sys {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
          ... on ContentfulPageSectionVideo {
            __typename
            title
            videoLink
            bodyAtTheEnd {
              raw
              references {
                ... on ContentfulCallToActionButton {
                  # __typename and contentful_id are required to resolve the references
                  __typename
                  contentful_id
                  id
                  internalReference {
                    slug
                  }
                  openInNewTab
                  linkLong {
                    linkLong
                  }
                  link
                  jumpTo
                  mailtoSubject
                  mailtoBody {
                    mailtoBody
                  }
                  mailto
                  text
                  copyToClipboard {
                    copyToClipboard
                  }
                  sys {
                    contentType {
                      sys {
                        id
                      }
                    }
                  }
                }
              }
            }
            colorScheme
          }
          ... on ContentfulPageSectionIllustration {
            __typename
            sloganLine1
            sloganLine2
          }
          ... on ContentfulPageSectionIntro {
            __typename
            preTitle
            title
            subTitle
            backgroundImage {
              gatsbyImageData(width: 1500, layout: CONSTRAINED, quality: 80)
            }
          }
          ... on ContentfulPageSectionWithComponents {
            __typename
            headline {
              headline
            }
            sectionId
            keyVisual
            showForOwnMunicipality
            titleShort
            colorScheme
            ags
            components {
              ... on ContentfulSectionComponentStandard {
                __typename
                column
                videoLink
                signUpButton
                image {
                  gatsbyImageData(width: 500, layout: CONSTRAINED, quality: 90)
                }
                text {
                  raw
                  references {
                    ... on ContentfulAsset {
                      # __typename and contentful_id are required to resolve the references
                      __typename
                      contentful_id
                      gatsbyImageData(
                        width: 500
                        layout: CONSTRAINED
                        quality: 90
                      )
                      description
                      title
                      file {
                        details {
                          image {
                            height
                            width
                          }
                          size
                        }
                        fileName
                        url
                        contentType
                      }
                    }
                  }
                }
              }
              ... on ContentfulSectionComponentTextAndImage {
                __typename
                column
                layout
                image {
                  gatsbyImageData(width: 500, layout: CONSTRAINED, quality: 90)
                }
                text {
                  raw
                  references {
                    ... on ContentfulCallToActionButton {
                      # __typename and contentful_id are required to resolve the references
                      __typename
                      contentful_id
                      id
                      internalReference {
                        slug
                      }
                      openInNewTab
                      linkLong {
                        linkLong
                      }
                      link
                      jumpTo
                      mailtoSubject
                      mailtoBody {
                        mailtoBody
                      }
                      mailto
                      text
                      copyToClipboard {
                        copyToClipboard
                      }
                      sys {
                        contentType {
                          sys {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
              ... on ContentfulSectionComponentTickerToSignup {
                __typename
                column
                tickerDescription {
                  tickerDescription
                }
              }
              ... on ContentfulSectionComponentMunicipalityMap {
                __typename
                column
              }
              ... on ContentfulSectionComponentMunicipalityProgress {
                __typename
                column
              }
              ... on ContentfulSectionComponentInviteFriends {
                __typename
                headline
                column
                body {
                  raw
                }
              }
              ... on ContentfulSectionComponentInviteFriends {
                __typename
                headline
                column
                body {
                  raw
                }
              }
              ... on ContentfulSectionComponentBecomeActive {
                __typename
                headline
                column
                body {
                  raw
                }
                fullWidthOnDesktop
              }
              ... on ContentfulSectionComponentInfoText {
                __typename
                fullWidthOnDesktop
                column
              }
              ... on ContentfulSectionComponentIntroText {
                __typename
                fullWidthOnDesktop
                column
                highlightText {
                  highlightText
                }
                note {
                  note
                }
              }
              ... on ContentfulSectionComponentProfileTile {
                __typename
                column
                body {
                  raw
                }
                fullWidthOnDesktop
              }
              ... on ContentfulSectionComponentCollectionMap {
                __typename
                column
                maps {
                  name
                  state
                  config {
                    maxBounds
                    zoom
                    center
                  }
                }
                text {
                  raw
                }
              }
            }
          }
          ... on ContentfulPageSectionDonation {
            __typename
            introText
            theme
            colorScheme
          }
          ... on ContentfulPageSectionShare {
            __typename
            introText
            colorScheme
            previewDescription {
              raw
            }
          }
        }
      }
    }
  }
`;
