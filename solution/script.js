const countriesUrl = 'https://restcountries.com/v3.1/independent?status=true';
const countryUrl = `https://restcountries.com/v3.1/alpha/`;

async function fetchApi(endpoint) {
  try {
    const response = await fetch(endpoint);
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

// do this then put on the DOM
// getData().then((result) => {
//   if (typeof result === 'string' && result.startsWith('Error')) {
//     console.error(result);
//   } else {
//     console.log(result);
//   }
// });

async function createFlags() {
  let allCountries = document.getElementById('countryflags');

  const result = await getData(countriesUrl);

  if (typeof result === 'string' && result.startsWith('Error')) {
    console.error(result);
  } else {
    // alphabetical order
    result.sort((a, b) => a.name.common.localeCompare(b.name.common));

    result.forEach((country) => {
      let newCountry = document.createElement('div');
      newCountry.id = country.cca2;
      newCountry.classList.add('country');
      newCountry.innerHTML = `
        <h4>${country.name.common}</h4>
        <img class="flag" src="${country.flags.png}">
      `;

      newCountry.addEventListener('mousedown', (e) => {
        e.preventDefault();
        displayData(country.cca2);
      });

      allCountries.appendChild(newCountry);
    });
  }
}

async function displayData(idCode) {
  const result = await getData(countryUrl + idCode);

  if (typeof result === 'string' && result.startsWith('Error')) {
    console.error(result);
  } else {
    country = result[0];
    console.log(country);
    const selectedCountry = document.getElementById('selectedCountry');
    selectedCountry.innerText = country.name.common;
    const selectedCountryDetails = document.getElementById(
      'selectedCountryDetails'
    );

    const info = `
      Flag: ${country.flag}<br>
      Capital: ${country.capital[0]}<br>
      Population: ${country.population}<br>
      Map: <a href="${country.maps.googleMaps}" target="blank">${country.maps.googleMaps}</a>
      `;
    selectedCountryDetails.innerHTML = `${info}`;
  }
}

createFlags();
