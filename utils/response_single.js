const sendApiResponseSingle = (res, data, message, status) => {
  res.status(status).json({
    data,
    message,
    status,
  });
};

module.exports = sendApiResponseSingle;
