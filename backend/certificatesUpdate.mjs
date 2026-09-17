// Certificates with issuer, issue date, credential id and verification link.
import 'dotenv/config';
import dns from 'node:dns';
import fs from 'node:fs';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import Certificate from './src/models/Certificate.js';

const url = (id) => `https://www.coursera.org/account/accomplishments/specialization/${id}`;

const CERTS = [
  {
    title: 'Apache Kafka Specialization',
    issuer: 'LearnKartS',
    date: 'Oct 2025',
    credentialId: '7DN6PYYKX9H2',
    order: 1,
  },
  {
    title: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI · Stanford Online',
    date: 'Dec 2025',
    credentialId: 'NIO29VDJY3VW',
    order: 2,
  },
  {
    title: 'Microsoft AI & ML Engineering Professional Certificate',
    issuer: 'Microsoft',
    date: 'Dec 2025',
    credentialId: '52EEGDGTG0ZJ',
    order: 3,
  },
  {
    title: 'GraphQL Mastery: From Fundamentals to Production Specialization',
    issuer: 'Board Infinity',
    date: 'Sep 2025',
    credentialId: '61MHDJ3OBMVB',
    order: 4,
  },
  {
    title: 'IBM JavaScript Backend Specialization',
    issuer: 'IBM',
    date: 'Sep 2025',
    credentialId: 'NMUIPX5CWE2X',
    order: 5,
  },
  {
    title: 'Meta Front-End Developer',
    issuer: 'Meta',
    date: 'Aug 2025',
    credentialId: 'O061412S2TM4',
    order: 6,
  },
];

await mongoose.connect(process.env.MONGO_URI);

const before = await Certificate.find({}).lean();
fs.writeFileSync('certificates-before.json', JSON.stringify(before, null, 2), 'utf8');
console.log(`backed up ${before.length} existing certificates to backend/certificates-before.json\n`);

// Remove obsolete linkedInUrl and imageUrl from MongoDB collection, and delete old placeholders
await Certificate.updateMany({}, { $unset: { linkedInUrl: "", imageUrl: "" } });
await Certificate.deleteMany({ credentialId: { $in: ['', null] } });

for (const doc of CERTS) {
  doc.credentialUrl = url(doc.credentialId);

  let existing = await Certificate.findOne({ credentialId: doc.credentialId });
  if (!existing) existing = await Certificate.findOne({ title: doc.title });

  if (existing) {
    const wasTitled = existing.title;
    Object.assign(existing, doc);
    await existing.save();
    console.log(`updated  ${doc.title}${wasTitled !== doc.title ? `  (was "${wasTitled}")` : ''}`);
  } else {
    await Certificate.create(doc);
    console.log(`created  ${doc.title}`);
  }
}

console.log('\nCertificates now:');
for (const c of await Certificate.find({}, 'title issuer date credentialId credentialUrl order').sort({ order: 1 }).lean()) {
  console.log(`  [${c.order}] ${c.title}`);
  console.log(`       ${c.issuer} · ${c.date} · ${c.credentialId || 'no id'}`);
  console.log(`       ${c.credentialUrl || 'no link'}`);
}

await mongoose.disconnect();
