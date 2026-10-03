const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  try {
    const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='orders';");
    console.log(res.rows.map(r => `${r.column_name} (${r.data_type})`).join('\n'));
  } finally {
    await client.end();
  }
}
run();
