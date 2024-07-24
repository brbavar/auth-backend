/auth-backend/node_modules/@smithy/smithy-client/dist-cjs/index.js:839\
&emsp;  const response = new exceptionCtor({\
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;^

ValidationException: ExpressionAttributeNames can only be specified when using expressions\
&emsp;    at throwDefaultError (/auth-backend/node_modules/@smithy/smithy-client/dist-cjs/index.js:839:20)\
&emsp;    at /auth-backend/node_modules/@smithy/smithy-client/dist-cjs/index.js:848:5\
&emsp;    at de_CommandError (/auth-backend/node_modules/@aws-sdk/client-dynamodb/dist-cjs/index.js:2230:14)\
&emsp;    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\
&emsp;    at async /auth-backend/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20\
&emsp;    at async /auth-backend/node_modules/@aws-sdk/lib-dynamodb/dist-cjs/index.js:164:30\
&emsp;    at async /auth-backend/node_modules/@smithy/core/dist-cjs/index.js:165:18\
&emsp;    at async /auth-backend/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38\
&emsp;    at async /auth-backend/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22\
&emsp;    at async getPassword (file:///auth-backend/controllers/acct-controller.js:174:28) {\
&ensp;  '$fault': 'client',\
&ensp;  '$metadata': {\
&emsp;    httpStatusCode: 400,\
&emsp;    requestId: 'RJVIB72GL39PBR5DHPEPQIFQTRVV4KQNSO5AEMVJF66Q9ASUAAJG',\
&emsp;    extendedRequestId: undefined,\
&emsp;    cfId: undefined,\
&emsp;    attempts: 1,\
&emsp;    totalRetryDelay: 0\
  },\
&ensp;  __type: 'com.amazon.coral.validate#ValidationException'\
}\
\
Node.js v21.6.2
