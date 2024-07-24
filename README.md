/auth-backend/node_modules/@smithy/smithy-client/dist-cjs/index.js:839\
  const response = new exceptionCtor({
                   ^

ValidationException: ExpressionAttributeNames can only be specified when using expressions\
    at throwDefaultError (/auth-backend/node_modules/@smithy/smithy-client/dist-cjs/index.js:839:20)\
    at /auth-backend/node_modules/@smithy/smithy-client/dist-cjs/index.js:848:5\
    at de_CommandError (/auth-backend/node_modules/@aws-sdk/client-dynamodb/dist-cjs/index.js:2230:14)\
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\
    at async /auth-backend/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20\
    at async /auth-backend/node_modules/@aws-sdk/lib-dynamodb/dist-cjs/index.js:164:30\
    at async /auth-backend/node_modules/@smithy/core/dist-cjs/index.js:165:18\
    at async /auth-backend/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38\
    at async /auth-backend/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22\
    at async getPassword (file:///auth-backend/controllers/acct-controller.js:174:28) {\
  '$fault': 'client',\
  '$metadata': {\
    httpStatusCode: 400,\
    requestId: 'RJVIB72GL39PBR5DHPEPQIFQTRVV4KQNSO5AEMVJF66Q9ASUAAJG',\
    extendedRequestId: undefined,\
    cfId: undefined,\
    attempts: 1,\
    totalRetryDelay: 0\
  },\
  __type: 'com.amazon.coral.validate#ValidationException'\
}\
\
Node.js v21.6.2
