import stateNames from '../data/states';

async function getCurrDataForUS(searchDate) {
  const today = new Date();
  let json;

  if (today.toDateString() == searchDate.toDateString()) {
    let response = await fetch(`https://covidtracking.com/api/v1/us/current.json`);
    json = await response.json();
  } else {
    const year = searchDate.getFullYear();
    let month = searchDate.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let date = searchDate.getDate();
    if (date < 10) {
      date = `0${date}`;
    }

    const dateString = `${year}${month}${date}`;
    let response = await fetch(`https://covidtracking.com/api/v1/us/${dateString}.json`);
    json = await response.json();
  }

  let data = Array.isArray(json) ? json[0] : json;
  if (data.error) {
    console.log(data);
    return null;
  }

  data.countryName = 'United States';

  return data;
}

async function getCurrDataForState(stateIndex, searchDate) {
  const state = stateNames[stateIndex];
  let query = state.abbr.toLowerCase();

  const today = new Date();
  let json;

  if (today.toDateString() == searchDate.toDateString()) {
    let response = await fetch(`https://covidtracking.com/api/v1/states/${query}/current.json`);
    json = await response.json();
  } else {
    const year = searchDate.getFullYear();
    let month = searchDate.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let date = searchDate.getDate();
    if (date < 10) {
      date = `0${date}`;
    }

    const dateString = `${year}${month}${date}`;
    let response = await fetch(`https://covidtracking.com/api/v1/states/${query}/${dateString}.json`);
    json = await response.json();
  }

  let data = Array.isArray(json) ? json[0] : json;
  if (data.error) {
    console.log(data);
    return null;
  }

  data.stateName = state.name;

  return data;
}

function parseData(data) {
  let {
    positive, death,
    hospitalizedCurrently, inIcuCurrently, recovered,
    positiveIncrease, deathIncrease, hospitalizedIncrease,
    hospitalizedCumulative
  } = data;

  let parsed = {
    confirmed: {
      value: positive,
      difference: positiveIncrease
    },
    death: {
      value: death,
      difference: deathIncrease
    },
    recovered: {
      value: recovered
    },
    hospitalized: {
      value: hospitalizedCurrently,
      difference: hospitalizedIncrease
    },
    "hospitalized-total": {
      value: hospitalizedCumulative
    },
    "in-intensive-care": {
      value: inIcuCurrently
    }
  };

  return parsed;
}

function convertEtToUtc(dateString) {
  return new Date(`${dateString} GMT-0400`);
}

export {
  getCurrDataForUS, getCurrDataForState,
  parseData, convertEtToUtc
};
