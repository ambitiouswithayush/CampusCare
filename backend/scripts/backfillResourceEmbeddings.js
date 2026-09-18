// One-time script: generates embeddings for resources that existed before
// the RAG feature was added. Run with: node scripts/backfillResourceEmbeddings.js
require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const { getEmbedding } = require('../utils/embeddings');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const resources = await Resource.find({ embedding: { $exists: false } });
  console.log(`Found ${resources.length} resources without embeddings`);

  for (const resource of resources) {
    const embedding = await getEmbedding(`${resource.title}. ${resource.description}`);
    if (embedding) {
      resource.embedding = embedding;
      await resource.save();
      console.log(`Embedded: ${resource.title}`);
    } else {
      console.log(`Skipped (embedding failed): ${resource.title}`);
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
