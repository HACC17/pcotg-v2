'use static';

var AWS = require('aws-sdk');

var config = require('./config.json');

var awsOptions = {
  region: config.region,
  apiVersion: '2012-08-10'
};

if (config.ddbEndpoint) {
  awsOptions.endpoint = config.ddbEndpoint;
}
if (config.accessKeyId) {
  awsOptions.accessKeyId = config.accessKeyId;
}
if (config.secretAccessKey) {
  awsOptions.secretAccessKey = config.secretAccessKey;
}

AWS.config.update(awsOptions);
console.log(awsOptions);
var doc = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context) {
  var params = {
    TableName: 'ealData',
    KeyConditionExpression: 'sheet = :hkey',
    ExpressionAttributeValues: {
      ':hkey': 'chemicalList'
    }
  };

  doc.query(params, function (err, data) {
    if (err) {
      console.log('Error:');
      console.log(err);
      context.succeed({
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*'
        },
        body: err.message
      });
    } else {
      console.log('Got Chemicals');
      context.succeed({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*'
        },
        body: JSON.stringify(data.Items[0].rows)
      });
    }
  });
};
