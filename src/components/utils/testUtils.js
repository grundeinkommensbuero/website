import { getFilteredElementsByContentfulState } from './index';

const testElements = [
  {
    ags: [],
    sectionId: 'TestComponentOne',
  },
  {
    ags: ['11000000'],
    sectionId: 'TestComponentOne',
  },
  {
    ags: [],
    sectionId: 'TestComponentTwo',
  },
  {
    ags: [],
    sectionId: 'TestComponentThree',
  },
];

const testMunicipalityContext = {
  ags: '02000000',
};

export const runElFilterTest = () => {
  const testResult = getFilteredElementsByContentfulState({
    elements: testElements,
    municipality: testMunicipalityContext,
    isAuthenticated: true,
    userData: {
      municipalities: [
        {
          name: 'Berlin',
          ags: '11000000',
        },
      ],
    },
  });

  console.log(testResult);
  return testResult;
};
