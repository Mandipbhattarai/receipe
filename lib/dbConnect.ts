import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

declare global {
  var dynamo:
    | {
        client: DynamoDBClient | null;
        docClient: DynamoDBDocumentClient | null;
      }
    | undefined;
}

let cached =
  global.dynamo ?? (global.dynamo = { client: null, docClient: null });

async function dbConnect() {
  if (cached.docClient) {
    return cached.docClient;
  }

  const AWS_REGION = process.env.AWS_REGION;

  if (!AWS_REGION) {
    throw new Error(
      "Please define the AWS_REGION environment variable inside .env.local"
    );
  }

  const client = new DynamoDBClient({
    region: AWS_REGION,
  });

  const docClient = DynamoDBDocumentClient.from(client);

  cached.client = client;
  cached.docClient = docClient;

  return docClient;
}

export default dbConnect;
