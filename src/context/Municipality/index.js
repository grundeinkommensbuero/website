import React, { useState, useEffect, useRef } from 'react';
import { useGetMunicipalityStats } from '../../hooks/Api/Municipalities';
import { history } from '../utils';
// import { usePrevious } from '../../hooks/utils';

import municipalities from '../../components/Municipality/MunicipalityMap/data/municipalitiesForMap.json';

export const MunicipalityContext = React.createContext();

export const MunicipalityProvider = ({ children }) => {
  // const prevMunicipality = usePrevious(municipality);
  const [isMunicipality, setIsMunicipality] = useState();
  const [municipality, setMunicipality] = useState();
  const [isSpecific, setIsSpecific] = useState();
  const [pageContext, setPageContext] = useState();
  const [statsSummary, setStatsSummary] = useState();
  const [municipalitiesGoalSignup, setMunicipalitiesGoalSignup] = useState([]);
  const [municipalitiesInObject, setMunicipalitiesInObject] = useState({});
  const [leaderboardSegments, setLeaderboardSegments] = useState({});

  // Stats for all municipalities
  const [
    allMunicipalityStatsState,
    allMunicipalityStats,
    getAllMunicipalityStats,
  ] = useGetMunicipalityStats();

  // Stats for just one municipality, will be set if a municipality is set
  const [
    singleMunicipalityStatsState,
    singleMunicipalityStats,
    getSingleMunicipalityStats,
  ] = useGetMunicipalityStats();

  const [
    municipalityContentfulState,
    setMunicipalityContentfulState,
  ] = useState('noMunicipality');

  const ags = useRef();

  // Get general municipality stats (of all munics)
  useEffect(() => {
    getAllMunicipalityStats();
  }, []);

  useEffect(() => {
    if (pageContext) {
      const {
        isMunicipality,
        isSpecificMunicipality,
        municipality,
        isFromHistoryEvent,
      } = pageContext;

      if (!isFromHistoryEvent) {
        history.replaceHistoryState(municipality, pageContext);
      }
      if (isMunicipality) {
        setIsMunicipality(true);
        if (isSpecificMunicipality) {
          setIsSpecific(true);
          setMunicipality(municipality);
        } else {
          setIsSpecific(false);
        }
      } else {
        setIsMunicipality(false);
        setIsSpecific(false);
        setMunicipality(undefined);
      }
    }
  }, [pageContext]);

  useEffect(() => {
    if (municipality) {
      if (
        typeof ags.current === undefined ||
        municipality.ags !== ags.current
      ) {
        ags.current = municipality.ags;
        getSingleMunicipalityStats(ags.current);
        setIsMunicipality(true);
        setIsSpecific(true);
        history.pushToHistoryState(municipality, pageContext);
        history.updateOnPopStateListener(
          municipality,
          setMunicipality,
          setPageContext
        );
        // TODO: We cannot know what state the municipality is in
        // but in case the municipality stats endpoint is down we should
        // set it to qualifying for now?
        setMunicipalityContentfulState('qualifying');
      }
    } else {
      ags.current = undefined;
      setMunicipalityContentfulState('noMunicipality');
      setIsSpecific(false);
      // ! IMPORTANT:
      // TODO: is it possible to set isMunicipality here?
      // QUESTION: Do we still have the generic /gemeinden site?
    }
  }, [municipality]);

  useEffect(() => {
    if (municipality && municipality.ags === ags.current) {
      const isQualifying =
        singleMunicipalityStats.signups < singleMunicipalityStats.goal;
      const isQualified =
        singleMunicipalityStats.signups >= singleMunicipalityStats.goal;
      // TODO: API Call
      const isCollecting = false;

      setMunicipality({
        ...municipality,
        ...singleMunicipalityStats,
        isQualifying,
        isQualified,
        isCollecting,
      });

      if (isCollecting) {
        setMunicipalityContentfulState('collecting');
      } else if (isQualified) {
        setMunicipalityContentfulState('qualified');
      } else if (isQualifying) {
        setMunicipalityContentfulState('qualifying');
      }
    }
  }, [singleMunicipalityStats]);

  useEffect(() => {
    if (allMunicipalityStats?.summary?.timestamp) {
      setStatsSummary(allMunicipalityStats.summary);
    }
  }, [allMunicipalityStats]);

  useEffect(() => {
    // Create Object with raw municipality data for faster reference
    const municipalityObject = municipalities.reduce(
      (muniObj, municipality) => {
        muniObj[municipality.ags.toString()] = {
          name: municipality.name,
          goal: municipality.goal,
          population: municipality.population,
        };
        return muniObj;
      },
      {}
    );
    // When there are events, add them to municipality key
    if (allMunicipalityStats.events) {
      allMunicipalityStats.events.forEach(e => {
        municipalityObject[e.ags.toString()] = {
          event: e,
          ...municipalityObject[e.ags.toString()],
        };
      });
    }
    setMunicipalitiesInObject(municipalityObject);
  }, [allMunicipalityStats]);

  useEffect(() => {
    // Find all municipalities with signups and goal
    const municipalitiesWithGoalAndSignups = [];
    if ('municipalities' in allMunicipalityStats) {
      allMunicipalityStats.municipalities.forEach(municipality => {
        if (municipality.ags.toString() in municipalitiesInObject) {
          const fullMunicipality = {
            ags: municipality.ags,
            signups: municipality.signups,
            percent: Math.round(
              (municipality.signups /
                municipalitiesInObject[municipality.ags.toString()].goal) *
                100
            ),
            ...municipalitiesInObject[municipality.ags.toString()],
          };
          municipalitiesWithGoalAndSignups.push(fullMunicipality);
        }
      });
      municipalitiesWithGoalAndSignups.sort((a, b) => {
        return b.percent - a.percent;
      });
      setMunicipalitiesGoalSignup(municipalitiesWithGoalAndSignups);
    }
  }, [municipalitiesInObject]);

  useEffect(() => {
    const segments = {
      hot: [],
      smallMunicipalities: [],
      largeMunicipalities: [],
      qualified: [],
    };
    municipalitiesGoalSignup.forEach(municipality => {
      if ('event' in municipality) {
        const beforePercent =
          (municipality.event.signups[0] / municipality.goal) * 100;
        const afterPercent =
          (municipality.event.signups[1] / municipality.goal) * 100;
        municipality.grewByPercent =
          Math.round((afterPercent - beforePercent) * 100) / 100;
        segments.hot.push(municipality);
      }
      if (municipality.percent >= 100) {
        segments.qualified.push(municipality);
      }
      if (municipality.percent < 100 && municipality.population < 20000) {
        segments.smallMunicipalities.push(municipality);
      }
      if (municipality.percent < 100 && municipality.population > 20000) {
        segments.largeMunicipalities.push(municipality);
      }
    });
    segments.hot.sort((a, b) => b.grewByPercent - a.grewByPercent);
    segments.qualified.sort((a, b) => b.population - a.population);
    setLeaderboardSegments(segments);
  }, [municipalitiesGoalSignup]);

  return (
    <MunicipalityContext.Provider
      value={{
        isMunicipality,
        setIsMunicipality,
        municipality,
        setMunicipality,
        isSpecific,
        setIsSpecific,
        municipalityContentfulState,
        setPageContext,
        allMunicipalityStats,
        allMunicipalityStatsState,
        singleMunicipalityStats,
        singleMunicipalityStatsState,
        statsSummary,
        municipalitiesGoalSignup,
        leaderboardSegments,
        refreshContextStats: () => getAllMunicipalityStats(),
      }}
    >
      {children}
    </MunicipalityContext.Provider>
  );
};
