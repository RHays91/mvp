module.exports = {

  sendResponse: function(res, data, statusCode) {
    var headers = {
      'access-control-allow-orgin': '*',
      'access-control-allow-methods' : 'GET, POST, PUT, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type, accept',
      'Content-Type': 'text/html'
    };
    statusCode = statusCode || 200;
    res.status(statusCode).json(data);
  },

  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },

  errorHandler: function (error, req, res, next) {
    res.status(500).send({error: error.message});
  }

};