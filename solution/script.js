const countriesUrl = 'https://restcountries.com/v3.1/independent?status=true';
const countryUrl = `https://restcountries.com/v3.1/alpha/`; // + country code

async function fetchApi(url) {
  try {
    const response = await fetch(url);
    if (response.status == 400) {
      throw new Error('Something went wrong');
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    return { error: err.message };
  }
}

async function getData(url) {
  const allData = await fetchApi(url);

  if (allData.error) {
    return `Error fetching data: ${allData.error}`;
  }

  return allData;
}

async function createFlags() {
  // get the countryflags div
  let allCountries = document.getElementById('countryflags');

  // get data for all countries
  const result = await getData(countriesUrl);

  // put countries in alphabetical order
  result.sort((a, b) => a.name.common.localeCompare(b.name.common));

  // loop through the countries
  result.forEach((country) => {
    // each country gets its own div
    let newCountry = document.createElement('div');
    newCountry.id = country.cca2;
    newCountry.classList.add('country');
    newCountry.innerHTML = `
        <h4>${country.name.common}</h4>
        <img class="flag" src="${country.flags.png}">
      `;

    // event listener
    newCountry.addEventListener('click', (e) => {
      // e.preventDefault();
      // on click it should show the data
      displayData(country.cca2);
      newCountry.classList.add('spinner');
    });

    allCountries.appendChild(newCountry);
  });
}

// function for displaying data in the selected country section.
async function displayData(idCode) {
  // get data for the individual country (why did I do this? There's a good reason!)
  const result = await getData(countryUrl + idCode);

  country = result[0];
  // get the selectedCountry div
  const selectedCountry = document.getElementById('selectedCountry');
  // put the info in the h3
  selectedCountry.innerText = country.name.common;
  // get selectedCountryDetails
  const selectedCountryDetails = document.getElementById(
    'selectedCountryDetails'
  );

  // inner HTML for the info selectedCountryDetails div
  const info = `
      Flag: ${country.flag}<br>
      Capital: ${country.capital[0]}<br>
      Population: ${country.population}<br>
      Map: <a href="${country.maps.googleMaps}" target="blank">${country.maps.googleMaps}</a>
      `;
  selectedCountryDetails.innerHTML = `${info}`;
}

createFlags();
