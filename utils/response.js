const sendApiResponse = (res, data, page, limit, count, message, status) => {
  res.status(status).json({
    data,
    page,
    limit,
    count,
    message,
    status,
  });
};

module.exports = sendApiResponse;
