import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Middleware autenticazione
function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Token mancante" });
  const token = header.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: "Token non valido" });
    req.user = payload; // { id, company_id, role }
    next();
  });
}

// 🔹 Registrazione
app.post("/auth/register", async (req, res) => {
  const { email, password, name, companyName } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const companyRes = await pool.query(
      "INSERT INTO companies (name) VALUES ($1) RETURNING id",
      [companyName || `${name} Company`]
    );
    const companyId = companyRes.rows[0].id;
    const userRes = await pool.query(
      `INSERT INTO users (email, password_hash, name, company_id, role)
       VALUES ($1,$2,$3,$4,'admin')
       RETURNING id,email,company_id,role`,
      [email, hash, name, companyId]
    );
    await pool.query("INSERT INTO alert_config (company_id) VALUES ($1)", [companyId]);
    res.status(201).json(userRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore registrazione" });
  }
});

// 🔹 Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = userRes.rows[0];
    if (!user) return res.status(401).json({ error: "Credenziali errate" });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenziali errate" });
    const token = jwt.sign(
      { id: user.id, company_id: user.company_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Errore login" });
  }
});

// 🔹 Macchine
app.get("/machines", auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM vending_machines WHERE company_id=$1",
      [req.user.company_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Errore caricamento macchine" });
  }
});

app.post("/machines", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Solo admin possono creare macchine" });
  const { name, location, latitude, longitude, status } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO vending_machines
       (company_id,name,location,latitude,longitude,status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.company_id, name, location, latitude, longitude, status || "active"]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Errore creazione macchina" });
  }
});

// 🔹 Prodotti
app.get("/products", auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*
       FROM products p
       JOIN vending_machines vm ON p.machine_id=vm.id
       WHERE vm.company_id=$1`,
      [req.user.company_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Errore caricamento prodotti" });
  }
});

app.post("/products", auth, async (req, res) => {
  const { machine_id, name, barcode, expire_at, quantity } = req.body;
  try {
    const vmRes = await pool.query(
      "SELECT company_id FROM vending_machines WHERE id=$1",
      [machine_id]
    );
    if (vmRes.rowCount === 0 || vmRes.rows[0].company_id !== req.user.company_id)
      return res.status(403).json({ error: "Macchina non autorizzata" });
    const { rows } = await pool.query(
      `INSERT INTO products (machine_id,name,barcode,expire_at,quantity,scanned_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [machine_id, name, barcode, expire_at, quantity || 1, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Errore creazione prodotto" });
  }
});

// 🔹 Stats
app.get("/stats", auth, async (req, res) => {
  try {
    const macchineRes = await pool.query(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status='active') AS active
       FROM vending_machines WHERE company_id=$1`,
      [req.user.company_id]
    );
    const productsRes = await pool.query(
      `SELECT expire_at
       FROM products p
       JOIN vending_machines vm ON p.machine_id=vm.id
       WHERE vm.company_id=$1`,
      [req.user.company_id]
    );
    const now = new Date();
    let total=0, expired=0, expiring=0, healthy=0;
    productsRes.rows.forEach(p => {
      total++;
      const days = Math.ceil((new Date(p.expire_at)-now)/(1000*60*60*24));
      if (days<=0) expired++;
      else if (days<=7) expiring++;
      else healthy++;
    });
    res.json({
      totalMachines: parseInt(macchineRes.rows[0].total,10),
      activeMachines: parseInt(macchineRes.rows[0].active,10),
      totalProducts: total,
      expiredProducts: expired,
      expiringProducts: expiring,
      healthyProducts: healthy
    });
  } catch (err) {
    res.status(500).json({ error: "Errore calcolo stats" });
  }
});

// ✅ Endpoint di test
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// ✅ Avvio server in ascolto su tutte le interfacce
app.listen(process.env.PORT, "0.0.0.0", () =>
  console.log(`✅ Backend avviato su http://0.0.0.0:${process.env.PORT}`)
);