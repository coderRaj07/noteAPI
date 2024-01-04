// // src/config/elasticsearch.js
// const { Client } = require('@elastic/elasticsearch');

// // Create an Elasticsearch client
// const esClient = new Client({ node: 'https://172.17.0.2:9200' }); // Adjust the URL based on your Elasticsearch server

// // src/config/elasticsearch.js

// // ...

// async function createIndex(indexName) {
//   let retries = 3;

//   while (retries > 0) {
//     try {
//       await esClient.indices.create({ index: indexName });
//       console.log(`Index '${indexName}' created successfully.`);
//       break; // Break out of the loop if successful
//     } catch (error) {
//       console.error(`Error creating index: ${error}`);
//       retries -= 1;
//       if (retries === 0) {
//         throw error; // If retries are exhausted, throw the error
//       }
//       // Add a delay before retrying (e.g., exponential backoff)
//       await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, 3 - retries)));
//     }
//   }
// }

// // ...
// const indexName = 'notes';

// module.exports = { esClient, createIndex, indexName };



const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');

async function getElasticsearchContainerIp(containerId) {
  try {
    const containerInfo = await axios.get(`http://localhost:9200/containers/${containerId}/json`);
    const containerIp = containerInfo.data.NetworkSettings.IPAddress;
    return containerIp;
  } catch (error) {
    console.error('Error retrieving Elasticsearch container IP:', error.message);
    throw error; 
  }
}

async function configureElasticsearchClient(containerId) {
  try {
    const elasticsearchIp = await getElasticsearchContainerIp(containerId);

    if (elasticsearchIp) {
      const elasticsearchAddress = `http://${elasticsearchIp}:9200`;
      const esClient = new Client({
        node: elasticsearchAddress,
      });
      return esClient;
    } else {
      throw new Error('Elasticsearch IP is not available');
    }
  } catch (error) {
    console.error('Error configuring Elasticsearch client:', error.message);
    throw error;
  }
}

(async () => {
  try {
    const containerId = 'dcb6143436fe'; 
    const configuredClient = await configureElasticsearchClient(containerId);

    const response = await configuredClient.ping();
    console.log(response);

    module.exports = { indexName };
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();

