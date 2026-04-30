exports.handler = async (event) => {
  console.log('Lambda invoked with event:', JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda! Multi-platform deployment successful.',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    })
  };
};