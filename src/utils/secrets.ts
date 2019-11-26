export const MONGODB_URI: string = process.env.MONGODB_URI || '';

if(!MONGODB_URI) {
  console.log('Missing enviornmental variable. Set MONGODB_URI environment variable.')
  process.exit(1);
}