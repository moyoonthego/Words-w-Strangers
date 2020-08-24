const axios = require('axios');
module.exports = axios.create({
  baseURL: 'https://api.todaqfinance.net',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '01bfb8d6-e846-4e47-a63d-332d1b76b2c2'
  }
});
