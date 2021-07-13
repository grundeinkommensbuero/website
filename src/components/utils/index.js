import React from 'react';
import { List as Loader } from 'react-content-loader';
// create a valid ID for usage in the DOM
export function stringToId(string) {
  return string && string.toString().replace(/^[^a-z]+|[^\w:.-]+/gi, '');
}

// Generates a random string (e.g. for generating random password)
export function getRandomString(bytes) {
  const randomValues = new Uint8Array(bytes);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map(intToHex)
    .join('');
}

function intToHex(nr) {
  return nr.toString(16).padStart(2, '0');
}

// https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
export const objectMap = (object, mapFn) => {
  return Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
};

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
export function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// https://stackoverflow.com/questions/8922107/javascript-scrollintoview-middle-alignment
export function scrollIntoView(element) {
  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const middle = absoluteElementTop - window.innerHeight / 2;
  window.scrollTo(0, middle);
}

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// usage for matomo https://matomo.org/docs/event-tracking/
export function trackEvent({ category, action, name, value }) {
  if (window._paq) {
    window._paq.push(['trackEvent', category, action, name, value]);
  }
}

export function addActionTrackingId(action, id) {
  return id ? `${action}-${id}` : action;
}

export function shouldShowPartners() {
  return testUrls(['brandenburg-4', 'brandenburg-5']);
}

function testUrls(urls) {
  return !!urls.find(
    url => typeof window !== 'undefined' && window.location.href.includes(url)
  );
}

export function getAbTestId() {
  const URLpart = 'brandenburg';
  const href = typeof window !== 'undefined' && window.location.href;
  const indexOf = href.indexOf(URLpart);

  if (indexOf !== -1) {
    const URLpartDash = URLpart + '-';
    const indexDash = href.indexOf(URLpartDash);

    if (indexDash !== -1) {
      return parseInt(href[indexDash + URLpartDash.length]);
    }

    return 0;
  }
  return -1;
}

export function formatDateTime(date) {
  return `${formatDate(date)}, ${formatTime(date)} Uhr`;
}

export function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('de', options).format(date);
}

export function formatDateShort(date) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('de', options).format(date);
}

export function formatDateMonthYear(date) {
  const options = {
    year: 'numeric',
    month: 'long',
  };
  return new Intl.DateTimeFormat('de', options).format(date);
}

export function formatTime(date) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };
  return new Intl.DateTimeFormat('de', options).format(date);
}

// Takes campaign code in the format of e.g. schleswig-holstein-1 or berlin-1
// and transforms it to Schleswig-Holstein or Berlin
export function mapCampaignCodeToState(campaignCode) {
  const stringSplit = campaignCode.split('-');
  if (stringSplit.length > 2) {
    return `${capitalize(stringSplit[0])}-${capitalize(stringSplit[1])}`;
  } else {
    return `${capitalize(stringSplit[0])}`;
  }
}

function capitalize(string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

export function getMailtoUrl(to, subject, body) {
  var args = [];
  if (typeof subject !== 'undefined') {
    args.push('subject=' + encodeURIComponent(subject));
  }
  if (typeof body !== 'undefined') {
    args.push('body=' + encodeURIComponent(body));
  }

  var url = 'mailto:' + encodeURIComponent(to);
  if (args.length > 0) {
    url += '?' + args.join('&');
  }
  return url;
}

export const setWindowLocationOriginForIE = () => {
  if (!window.location.origin) {
    window.location.origin =
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '');
  }
};

export const getStringFromPlaceholderText = (string, object) => {
  if (!string) {
    return '';
  }
  let result = string;
  // Find strings in curly braces
  let matches = string.match(/{([^}]+)}/g);
  // Without curly braces in the string
  // no placeholder is defined and
  // we can return
  if (!matches) {
    return string;
  }
  // Remove curly braces
  matches = matches.map(s => s.replace(/({|})/g, ''));

  const regexSubInSingleQuotes = /^'.*'$/;

  matches.forEach(e => {
    let replacement = '';
    // The condition is not evaluated!
    // The ternary structure is only
    // a reminder for the structure
    // of the replacement.
    const splitByCondition = e.split('?');

    if (typeof splitByCondition[1] !== 'string') {
      return string;
    }

    const options = splitByCondition[1].split(':');
    // Second option should be the default one
    // based on the template
    let selector = 0;
    if (typeof object === 'undefined') {
      selector = 1;
    }
    // NOTE: check with . is a bit impractical,
    // when a dot is needed in the string
    const isInQuotes = regexSubInSingleQuotes.test(options[selector].trim());
    if (isInQuotes) {
      replacement = options[selector].replace(/'/g, ``).trim();
    } else {
      const objectKey = options[selector].split(`.`)[1].trim();
      replacement = object[objectKey];
    }
    result = result.replace(e, replacement);
  });
  result = result.replace(/{/g, '').replace(/}/g, '');

  return result;
};

export const detectWebGLContext = () => {
  // Create canvas element. The canvas is not added to the
  // document itself, so it is never displayed in the
  // browser window.
  if (typeof window !== `undefined`) {
    var canvas = document.createElement('canvas');
    // Get WebGLRenderingContext from canvas element.
    var gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    // Report the result.
    if (gl && gl instanceof WebGLRenderingContext) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};
const stateToAgs = {
  berlin: '11000000',
  bremen: '04011000',
  hamburg: '02000000',
};

// Map campaign code to ags by extracting state out of campaign code
// ad mapping that state to the ags
export function mapCampaignCodeToAgs(campaignCode) {
  return stateToAgs[campaignCode.split('-')[0]];
}

export const getFilteredElementsByContentfulState = ({
  elements,
  municipality,
  isAuthenticated,
  userMunicipalityState,
}) => {
  return elements?.filter(el => {
    let showState = true;

    // If no municipality is set (for start page) we render every section
    // if municipality is set, we check if section should be rendered for this
    // municipality based on the ags attribute in contentful. If there is a default section
    // with a specific sectionId it should be overwritten, if there is specific section with an ags.
    if (municipality?.ags) {
      if (el.ags?.length) {
        if (!el.ags.includes(municipality.ags)) {
          showState = false;
        }
      } else if (
        el.sectionId !== '' &&
        elements.findIndex(
          ({ sectionId, ags }) =>
            sectionId === el.sectionId &&
            ags?.length &&
            ags.includes(municipality.ags)
        ) !== -1
      ) {
        showState = false;
      }
    }

    // If element has checkbox showForOwnMunicipality we only render the component
    // if user is signed in and has signed up for that municipality.
    if (
      el.showForOwnMunicipality &&
      (!municipality?.ags ||
        !isAuthenticated ||
        userMunicipalityState !== 'loggedInThisMunicipalitySignup')
    ) {
      showState = false;
    }

    // Check if false, because default is null and default means show everywhere,
    // while false means don't show element for own municipality
    if (
      el.showForOwnMunicipality === false &&
      userMunicipalityState === 'loggedInThisMunicipalitySignup'
    ) {
      showState = false;
    }

    return showState;
  });
};

export const getComponentFromContentful = ({ Components, component }) => {
  const componentSelector = component.__typename.replace(
    'ContentfulSectionComponent',
    ''
  );

  const ComponentToRender = Components[componentSelector];

  if (typeof ComponentToRender !== 'undefined') {
    return <ComponentToRender {...component} fallback={<Loader />} />;
  } else {
    return (
      <div>The component {componentSelector} has not been created yet.</div>
    );
  }
};
