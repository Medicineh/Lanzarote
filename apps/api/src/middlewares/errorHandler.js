export function errorHandler(err, req, res, next) {
  req.log?.error({ err }, 'Unhandled error');
  res.status(500).json({ error: err.message || 'Internal Server Error' });
}
