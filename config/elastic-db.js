const { Client } = require('@elastic/elasticsearch-serverless');
const elasticClient = new Client({
  node: 'https://b02dbd1cb5f743b7a3bb562311b5ea1b.es.us-east-1.aws.elastic.cloud:443',
  auth: {
    apiKey: 'MlNNbjVJOEJTRzF1WGx6Y293QXI6OTVpY1JJTFNRaEdrcWV2Z3dXV3VOUQ=='
  }
});

async function connectDB(){
    try {
        await elasticClient.info();
        console.log('Elasticsearch connected');
      } catch (err) {
        console.error('Elasticsearch not connected', err);
      }
}

const createIndex = async (indexName) => {
    await elasticClient.indices.create({ index: indexName });
    console.log("Index created");
};



module.exports={elasticClient,connectDB, createIndex}