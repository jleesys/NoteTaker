const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.PORT, (error) => {
    if (!error) {
        logger.info(`Server running on port ${config.PORT}`);
    } else {
        logger.error(`Unable to connect to server.`);
    }
});