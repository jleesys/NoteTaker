const logger = require('./logger');

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method);
    logger.info('Path: ', request.path);
    logger.info('Body: ', request.body);
    logger.info('---');
    next();
};

const unknownEndpoint = (request, response) => {
    logger.error('Unknown endpoint.');
    response.status(404).json({ error: 'Unknown endpoint.' });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'ValidationError') {
        logger.error('');
        response.status(400).json({ error: 'Bad id.' });
    } else if (error.name === 'CastError') {
        logger.error('');
        response.status(400).json({ error: 'Bad id.' });
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};