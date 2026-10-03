import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
async function run() {
  try {
    await sql`ALTER TABLE orders ADD COLUMN customer_name_snapshot TEXT`;
    console.log("Added to orders");
  } catch (e) { console.error(e); }
  try {
    await sql`ALTER TABLE advance_orders ADD COLUMN customer_name_snapshot TEXT`;
    console.log("Added to advance_orders");
  } catch (e) { console.error(e); }
  
  // Populate existing data
  try {
    await sql`UPDATE orders SET customer_name_snapshot = (SELECT name FROM customers WHERE customers.id = orders.customer_id)`;
    console.log("Populated orders");
  } catch (e) { console.error(e); }
  try {
    await sql`UPDATE advance_orders SET customer_name_snapshot = (SELECT name FROM customers WHERE customers.id = advance_orders.customer_id)`;
    console.log("Populated advance_orders");
  } catch (e) { console.error(e); }
}
run();
