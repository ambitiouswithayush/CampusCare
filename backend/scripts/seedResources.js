// Seeds a handful of resources spanning different concern areas so the RAG
// retrieval in chatController.js has real variety to search over, instead of
// just the one "Understanding Anxiety" article. Uses real, working links to
// reputable mental health sources rather than placeholders.
// Run with: node scripts/seedResources.js
require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const { getEmbedding } = require('../utils/embeddings');

const resources = [
  {
    title: 'Managing Exam Stress',
    description: 'Practical techniques for handling exam pressure, including study pacing, breathing exercises, and reframing negative thoughts before a test.',
    category: 'article',
    link: 'https://www.helpguide.org/mental-health/anxiety/test-anxiety',
  },
  {
    title: 'Coping with Career Uncertainty',
    description: 'A guide for students feeling anxious about job prospects, choosing a career path, or comparing themselves to peers during placement season.',
    category: 'article',
    link: 'https://www.verywellmind.com/how-to-cope-with-career-uncertainty-5199781',
  },
  {
    title: 'Understanding Depression in College Students',
    description: 'Explains common signs of low mood and depression among students, why it happens, and when to seek professional help.',
    category: 'article',
    link: 'https://www.nimh.nih.gov/health/publications/depression',
  },
  {
    title: 'Improving Sleep Quality',
    description: 'Evidence-based tips for better sleep hygiene, dealing with insomnia caused by stress, and building a healthier nighttime routine.',
    category: 'guide',
    link: 'https://www.sleepfoundation.org/sleep-hygiene',
  },
  {
    title: 'Navigating Loneliness and Social Isolation',
    description: 'Support for students who feel isolated, disconnected from friends, or struggle to build new relationships on campus.',
    category: 'article',
    link: 'https://www.mind.org.uk/information-support/tips-for-everyday-living/loneliness/',
  },
  {
    title: '10-Minute Guided Breathing Meditation',
    description: 'A short guided audio meditation for calming anxiety and grounding yourself during a stressful moment.',
    category: 'audio',
    link: 'https://www.headspace.com/meditation/breathing-exercises',
  },
  {
    title: 'Building Healthy Relationships',
    description: 'Guidance on communication, setting boundaries, and resolving conflict in friendships and romantic relationships during college.',
    category: 'article',
    link: 'https://www.psychologytoday.com/us/basics/relationships',
  },
  {
    title: 'When to Seek Professional Help',
    description: 'How to recognize when stress, anxiety, or sadness has become serious enough to need a counselor, and what to expect from a first session.',
    category: 'guide',
    link: 'https://www.apa.org/topics/psychotherapy/understanding',
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const r of resources) {
    const exists = await Resource.findOne({ title: r.title });
    if (exists) {
      console.log(`Skipping (already exists): ${r.title}`);
      continue;
    }

    const embedding = await getEmbedding(`${r.title}. ${r.description}`);
    const resource = await Resource.create({ ...r, embedding: embedding || undefined });
    console.log(`Created: ${resource.title}${embedding ? '' : ' (embedding failed, will need backfill)'}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
