import express from 'express';

const router = express.Router();

const LTA_BUS_ARRIVAL_ENDPOINT = 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival';

export async function fetchLtaBusArrival(busStopCode, serviceNo, accountKeyOverride) {
  const accountKey =
    accountKeyOverride ||
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_DATAMALL_API_KEY ||
    '';

  const params = new URLSearchParams();
  params.set('BusStopCode', String(busStopCode).trim());
  if (serviceNo) {
    params.set('ServiceNo', String(serviceNo).trim());
  }

  const targetUrl = `${LTA_BUS_ARRIVAL_ENDPOINT}?${params.toString()}`;

  const headers = {
    accept: 'application/json',
  };

  if (accountKey) {
    headers['AccountKey'] = accountKey;
  }

  const response = await fetch(targetUrl, {
    method: 'GET',
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    url: targetUrl,
    data,
    hasAccountKey: Boolean(accountKey),
  };
}

router.get('/', async (req, res) => {
  const busStopCode = req.query.BusStopCode || req.query.busStopCode;
  const serviceNo = req.query.ServiceNo || req.query.serviceNo;
  const accountKeyHeader =
    req.headers['accountkey'] ||
    req.headers['account-key'] ||
    req.query.AccountKey;

  if (!busStopCode) {
    return res.status(400).json({
      error: 'BusStopCode is the only required parameter.',
      usage: {
        endpoint: '/api/bus-arrival?BusStopCode=04121',
        optionalParam: '&ServiceNo=7',
        example: '/api/bus-arrival?BusStopCode=04121&ServiceNo=124',
      },
    });
  }

  try {
    const result = await fetchLtaBusArrival(busStopCode, serviceNo, accountKeyHeader);

    // Set cache control for 20 seconds as LTA updates every 20 seconds
    res.setHeader('Cache-Control', 'public, max-age=20, s-maxage=20');

    if (!result.ok) {
      return res.status(result.status).json({
        error: `LTA DataMall API responded with status ${result.status} (${result.statusText})`,
        status: result.status,
        hasAccountKey: result.hasAccountKey,
        hint: !result.hasAccountKey
          ? 'LTA_ACCOUNT_KEY is not configured in environment variables or request headers. Please provide an AccountKey from https://datamall.lta.gov.sg/.'
          : 'Please verify that your LTA_ACCOUNT_KEY is valid and has not expired.',
        details: result.data,
      });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error fetching LTA Bus Arrival data:', error);
    return res.status(502).json({
      error: 'Failed to communicate with LTA DataMall gateway',
      message: error instanceof Error ? error.message : String(error),
      targetUrl: `${LTA_BUS_ARRIVAL_ENDPOINT}?BusStopCode=${busStopCode}`,
    });
  }
});

export default router;
