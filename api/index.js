import express from 'express';
import healthRouter from './health.js';
import busArrivalRouter from './bus-arrival.js';

const apiRouter = express.Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/bus-arrival', busArrivalRouter);
apiRouter.use('/BusArrival', busArrivalRouter);

// Root index for /api
apiRouter.get('/', (req, res) => {
  res.json({
    name: 'Metropolitan Transit LTA API Hub',
    description: 'Civic transit API endpoints for health monitoring and Singapore LTA DataMall BusArrival v3 gateway.',
    endpoints: {
      health: '/api/health',
      busArrival: '/api/bus-arrival?BusStopCode=04121[&ServiceNo=7]',
    },
    documentation: {
      busStopCode: '5-digit bus stop identifier (e.g. 04121 for City Hall Stn Exit B, 09048 for Orchard Stn)',
      serviceNo: 'Optional bus service number (e.g. 7, 14, 65, 147, 190)',
      refreshCadence: 'Refreshes every 20 seconds',
      header: 'AccountKey (via environment variable LTA_ACCOUNT_KEY or request header)',
    },
  });
});

export default apiRouter;
