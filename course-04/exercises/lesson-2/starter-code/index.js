"use strict";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;

exports.handler = async (event) => {
  console.log("Processing event: ", event);
  let nextKey;
  let limit;
  try {
    console.log("parsing Next Key");
    nextKey = parseNextKeyParameter(event);
    console.log("parsing limit");
    limit = parseLimitParameter(event);
  } catch (e) {
    console.error("Failed to parse query parameters", e.message);
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid parameters", message: e.message }),
    };
  }

  const scanParams = {
    TableName: groupsTable,
    Limit: limit,
    ExclusiveStartKey: nextKey,
  };
  console.log("Scan params: ", scanParams);

  const result = await docClient.scan(scanParams).promise();
  const items = result.Items;

  console.log("Result: ", result);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      items,
      nextKey: encodeNextKey(result.LastEvaluatedKey),
    }),
  };
};

/**
 * Get a query parameter or return "undefined"
 *
 * @param {Object} event HTTP event passed to a Lambda function
 * @param {string} name a name of a query parameter to return
 *
 * @returns {string} a value of a query parameter value or "undefined" if a parameter is not defined
 */
function getQueryParameter(event, name) {
  const queryParams = event.queryStringParameters;
  console.log("queryParams", queryParams);
  if (!queryParams) {
    return undefined;
  }

  return queryParams[name];
}

function parseNextKeyParameter(event) {
  const nextKey = getQueryParameter(event, "nextKey");
  return decodeNextKey(nextKey);
}

function parseLimitParameter(event) {
  let limit = getQueryParameter(event, "limit");
  if (!limit) {
    return 20;
  }

  limit = parseInt(limit, 10);
  if (limit <= 0) {
    throw new Error("Limit should be positive");
  }
  return limit;
}

/**
 * Encode last evaluated key using
 *
 * @param {Object} lastEvaluatedKey a JS object that represents last evaluated key
 *
 * @return {string} URI encoded last evaluated key
 */
function encodeNextKey(lastEvaluatedKey) {
  if (!lastEvaluatedKey) {
    return null;
  }
  return encodeURIComponent(JSON.stringify(lastEvaluatedKey));
}

function decodeNextKey(encodedNextKey) {
  if (!encodedNextKey) {
    return undefined;
  }
  return JSON.parse(decodeURIComponent(encodedNextKey));
}
