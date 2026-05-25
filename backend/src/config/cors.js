/** Allow all origins — Access-Control-Allow-Origin: * */
function getCorsOptions() {
  return {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}

module.exports = { getCorsOptions };
