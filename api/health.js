import express from 'express';

const router = express.Router();

export function getHealthStatus() {
  const accountKey = process.env.LTA_ACCOUNT_KEY || process.env.LTA_DATAMALL_API_KEY || '';
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'Metropolitan Transit LTA API Gateway',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      busArrival: '/api/bus-arrival?BusStopCode=04121[&ServiceNo=7]',
    },
    ltaConfig: {
      accountKeyConfigured: Boolean(accountKey),
      keyLength: accountKey ? accountKey.length : 0,
      targetEndpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    },
  };
}

router.get('/', (req, res) => {
  try {
    const health = getHealthStatus();
    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
