import React from 'react';
import Header from './Header';
import Footer from './Footer';
import s from './style.module.less';
import '../style/base.less';
import Sections from '../Sections';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

function Template({ children, sections }) {
  const { contentfulGlobalStuff: globalStuff } = useStaticQuery(graphql`
    query SiteTitleQuery {
      contentfulGlobalStuff(contentful_id: { eq: "4JZiSwNaoH4hsCp4sZd2G" }) {
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
      }
    }
  `);

  return (
    <>
      <Header sections={sections} />
      <Helmet
        defaultTitle={globalStuff.siteTitle}
        titleTemplate={`${globalStuff.siteTitle} - %s`}
      >
        <meta
          name="description"
          content={globalStuff.siteDescription.siteDescription}
        />
        <meta property="og:image" content={globalStuff.ogimage.fixed.src} />
        <link rel="icon" type="image/png" href="favicon.png" />
      </Helmet>
      <main className={s.main}>
        {children}
        <Sections sections={sections} />
      </main>
      <Footer
        footerText={globalStuff.footerText}
        footerMenu={globalStuff.footerMenu}
      />
    </>
  );
}

export default Template;
