const yargs = require('yargs');
const axios = require('axios');

const defaultAddress = require('./default-address/default-address.js');
const printTemperature = require('./print-temperature/print-temperature.js');

const argv = yargs
  .options({
    address: {
      describe: 'Address to fetch weather for',
      alias: 'a',
      string: true
    },
    default: {
      describe: 'Set as default address',
      alias: 'd',
      boolean: true
    },
    celsius: {
      describe: 'Convert temperature to Celsius',
      alias: 'c',
      boolean: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

var address = defaultAddress.getAddress(argv.address, argv.default);

if (address) {
  var encodedAddress = encodeURIComponent(address);
  var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

  axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address.');
    }

    var apiKey = '4fe5b68d1ee045ef5bff7fef478c2911';
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/${apiKey}/${lat},${lng}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
  }).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    printTemperature.printTemperature(temperature, apparentTemperature, argv.celsius);
  }).catch((e) => {
    if (e.code === 'ENOTFOUND') {
      console.log('Unable to connect to API servers.');
    } else {
      console.log(e.message);
    }
  });
}
