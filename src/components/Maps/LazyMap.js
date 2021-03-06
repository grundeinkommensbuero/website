import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { formatDateTime } from '../utils';
import { contentfulJsonToHtml } from '../utils/contentfulJsonToHtml';
import * as s from './style.module.less';
import { useStaticQuery, graphql } from 'gatsby';
import { SectionInner } from '../Layout/Sections';
import { FinallyMessage } from '../Forms/FinallyMessage';

import { detectWebGLContext } from '../utils';

let mapboxgl;

if (!process.env.STATIC) {
  mapboxgl = require('mapbox-gl');
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYW55a2V5IiwiYSI6ImNrM3JkZ2IwMDBhZHAzZHBpemswd3F3MjYifQ.RLinVZ2-Vdp9JwErHAJz6w';
}

const DEFAULT_BOUNDS = [
  [3, 47.217923],
  [17.030017, 55.437655],
];

/**
 * The `config` JSON field on a Contentful Map takes values that will be directly
 * passed in to the mapboxgl map constructor. This function extends the default mapbox config
 * only adding or overriding any properties that have a value on Contentful.
 *
 * @param {{}} defaultConfig Default mapbox config to add props to
 * @param {{key: string; value: any}[]} props Props that get added to or override default config
 */
const addPropsToMapboxConfig = (defaultConfig, props) => {
  if (!props) return defaultConfig;

  // Loop through each key of each prop
  const configWithoutNulls = Object.keys(props).reduce((acc, key) => {
    // If value, add to accumulator
    if (props[key]) {
      return {
        ...acc,
        [key]: props[key],
      };
    }
    // Otherwise, return accumulator
    return acc;
  }, {});

  // Merge Contentful properties with the default
  return {
    ...defaultConfig,
    ...configWithoutNulls,
  };
};

const lazyMap = ({ mapConfig }) => {
  const {
    allContentfulSammelort: { edges: collectSignaturesLocations },
  } = useStaticQuery(graphql`
    query CollectSignaturesLocations {
      allContentfulSammelort {
        edges {
          node {
            mail
            title
            phone
            location {
              lat
              lon
            }
            description {
              raw
            }
            date
            state
          }
        }
      }
    }
  `);

  const [hasWebGl, setHasWebGL] = useState(null);

  const container = useRef(null);
  const [highlightedPoint, setHighlightedPoint] = useState([]);
  let map;

  useEffect(() => {
    setHasWebGL(detectWebGLContext());
  }, []);

  useEffect(() => {
    if (hasWebGl) {
      const collectSignaturesLocationsFiltered = collectSignaturesLocations
        .filter(({ node: location }) => {
          if (!location.date) {
            return true;
          }
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          return +new Date(location.date) > +yesterday;
        })
        .filter(({ node: location }) => {
          return location.state === mapConfig.state;
        });

      // Default config for mapboxgl
      const mapboxConfigDefault = {
        container: container.current,
        style: 'mapbox://styles/mapbox/streets-v9',
        maxBounds: DEFAULT_BOUNDS,
      };

      const mapboxConfig = addPropsToMapboxConfig(
        mapboxConfigDefault,
        mapConfig.config
      );

      map = new mapboxgl.Map(mapboxConfig).addControl(
        new mapboxgl.NavigationControl(),
        'top-left'
      );

      collectSignaturesLocationsFiltered.forEach(({ node: location }) => {
        if (location.location) {
          new mapboxgl.Marker()
            .setLngLat([location.location.lon, location.location.lat])
            .addTo(map)
            .setPopup(
              new mapboxgl.Popup()
                .setHTML(renderToStaticMarkup(<PopupContent {...location} />))
                .on('open', () => {
                  highlightedPoint.push(location);
                  setHighlightedPoint([...highlightedPoint]);
                })
                .on('close', () => {
                  highlightedPoint.shift();
                  setHighlightedPoint([...highlightedPoint]);
                })
            );
        }
      });

      return () => {
        map.remove();
      };
    }
  }, [hasWebGl]);

  return (
    <>
      <SectionInner wide={true}>
        {hasWebGl === false && (
          <FinallyMessage>
            Entschuldige bitte, dein Browser unterstützt leider unsere Karte
            nicht, sie benötigt webGL. Bitte mache ein Update deines Browsers
            und/oder deines Betriebssystems oder probiere es in einem anderen
            Browser.
          </FinallyMessage>
        )}
        {(hasWebGl === true || hasWebGl === null) && (
          <div ref={container} className={s.container} />
        )}
      </SectionInner>
      {highlightedPoint.length !== 0 && (
        <SectionInner className={s.popUpOutside}>
          <div>
            <PopupContent {...highlightedPoint[0]} />
          </div>
        </SectionInner>
      )}
    </>
  );
};

const PopupContent = ({ title, description, date, phone, mail }) => (
  <div className={s.tooltip}>
    {date && (
      <div className={s.tooltopDate}>{formatDateTime(new Date(date))}</div>
    )}
    <div className={s.tooltopTitle}>{title}</div>
    {description && (
      <div className={s.tooltipDescription}>
        <hr />
        {contentfulJsonToHtml(description)}
      </div>
    )}
    {(phone || mail) && <hr />}
    {phone && (
      <div>
        <span aria-label="phone" role="img">
          📞
        </span>{' '}
        <a href={`tel:${phone}`}>{phone}</a>
      </div>
    )}
    {mail && (
      <div>
        <span aria-label="e-mail" role="img">
          ✉️
        </span>{' '}
        <a href={`mailto:${mail}`}>{mail}</a>
      </div>
    )}
  </div>
);

export default lazyMap;
