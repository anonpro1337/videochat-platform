const http = require('http');

async function handler(req, res) {
  const { method, url } = req;
  const origin = process.env.WEB_APP_URL || 'https://chatvibe-web.vercel.app';

  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  function json(data, status = 200) {
    const body = JSON.stringify(data);
    res.writeHead(status, {
      ...corsHeaders,
      'Content-Type': 'application/json',
    });
    res.end(body);
  }

  if (url === '/api/v1/health') {
    json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      checks: {
        database: process.env.DATABASE_URL ? 'configured' : 'missing',
        supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
      }
    });
  } else if (url === '/api/docs') {
    json({
      openapi: '3.0.0',
      info: { title: 'VideoChat Platform API', version: '1.0.0', description: 'Enterprise video chat platform API' },
      servers: [{ url: process.env.API_URL || 'https://api-tau-dusky-58.vercel.app' }],
      paths: {
        '/api/v1/health': { get: { tags: ['Health'], summary: 'Health check', responses: { '200': { description: 'API is healthy' } } } }
      }
    });
  } else if (url === '/api/v1') {
    json({
      message: 'VideoChat API v1',
      version: '1.0.0',
      endpoints: { health: '/api/v1/health', docs: '/api/docs' }
    });
  } else {
    json({
      name: 'VideoChat Platform API',
      version: '1.0.0',
      status: 'running',
      environment: process.env.NODE_ENV || 'development',
    });
  }
}

module.exports = handler;
