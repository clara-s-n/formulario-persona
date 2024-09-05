import pg from 'pg'
const { Pool } = pg
 
const pool = new Pool({
    'database': 'personas',
    'user': 'admin',
    'password': 'admin',
    'host': 'database',
    'port': 5432
})
 
export const query = async (text: string, params?: (string|number|string[]|number[])[]) => {
  // const start = Date.now()
  const res = await pool.query(text, params)
  // const duration = Date.now() - start
  // console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}