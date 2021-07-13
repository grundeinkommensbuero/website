import React, { useContext } from 'react';
import { List as Loader } from 'react-content-loader';
import { MunicipalityContext } from '../../../../context/Municipality';
import { useUserMunicipalityState } from '../../../../hooks/Municipality/UserMunicipalityState';
import { SignUpButton } from '../../../TickerToSignup/SignupButton';
import { contentfulJsonToHtml } from '../../../utils/contentfulJsonToHtml';
import { getButtonText } from '../../../TickerToSignup/SignupButtonAndTile';
import * as s from './style.module.less';
import { GatsbyImage } from 'gatsby-plugin-image';
import loadable from '@loadable/component';
const YoutubeEmbed = loadable(() => import('../../../YoutubeEmbed'));

export const StandardSectionComponent = ({
  videoLink,
  text,
  signUpButton,
  image,
}) => {
  const { municipality } = useContext(MunicipalityContext);
  const userMunicipalityState = useUserMunicipalityState();
  const buttonText = getButtonText(municipality, userMunicipalityState);

  return (
    <>
      {videoLink && <YoutubeEmbed url={videoLink} fallback={<Loader />} />}
      {image && image.gatsbyImageData && (
        <GatsbyImage image={image.gatsbyImageData} alt="" />
      )}
      {text && <div>{contentfulJsonToHtml(text)}</div>}
      {signUpButton && (
        <SignUpButton className={s.signUpCTA}>{buttonText}</SignUpButton>
      )}
    </>
  );
};
