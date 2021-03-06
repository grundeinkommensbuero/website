import React from 'react';
import Layout from '../../../components/Layout';
import { Helmet } from 'react-helmet-async';
import { Section } from '../../../components/Layout/Sections';
import { MunicipalityMap } from '../../../components/Municipality/MunicipalityMap';
import * as s from './style.module.less';

const PlaygroundCampaignMap = () => {
  return (
    <Layout>
      <Helmet>
        <title>Map</title>
      </Helmet>
      <Section className={s.sectionViolet}>
        <MunicipalityMap initialMapAnimation={false} animateOnScroll={false} />
      </Section>
    </Layout>
  );
};

export default PlaygroundCampaignMap;
