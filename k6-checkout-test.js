import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ── Custom metrics ─────────────────────────────────────────────────────────────
const orderSuccess    = new Rate('orders_placed_successfully');
const orderDuration   = new Trend('order_placement_duration');
const productDuration = new Trend('product_browse_duration');

// ── Test configuration ─────────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '30s', target: 5  },  // Montée progressive
    { duration: '1m',  target: 20 },  // Pic de 20 utilisateurs simultanés
    { duration: '30s', target: 0  },  // Descente
  ],
  thresholds: {
    // 95% des commandes doivent répondre en moins de 3 secondes
    'order_placement_duration': ['p(95)<3000'],
    // Moins de 1% d'échec sur les commandes
    'orders_placed_successfully': ['rate>0.99'],
    // Temps de navigation < 1 seconde (p95)
    'product_browse_duration': ['p(95)<1000'],
    'http_req_failed': ['rate<0.01'],
  },
};

const BASE_URL = 'https://api.atharfragrances.ma/api';

// ── Données de test réalistes ──────────────────────────────────────────────────
const CITIES = ['Tanger', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Agadir'];
const QUARTIERS = ['Mesnana', 'Hay Riad', 'Agdal', 'Guéliz', 'Ain Diab'];
const NAMES = ['Ahmed Benali', 'Fatima Zohra', 'Youssef Idrissi', 'Khadija Tazi', 'Omar Benjelloun'];
const PHONES = ['0661234567', '0662345678', '0663456789', '0664567890', '0665678901'];

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': 'https://atharfragrances.ma',
};

// ── Scénario principal ─────────────────────────────────────────────────────────
export default function () {
  const userIndex = __VU % NAMES.length;

  // ── Étape 1 : Récupérer le catalogue ──────────────────────────────────────
  const browseStart = Date.now();
  const productsRes = http.get(`${BASE_URL}/products`, { headers });
  productDuration.add(Date.now() - browseStart);

  const browseOk = check(productsRes, {
    'Catalogue chargé (200)': (r) => r.status === 200,
    'Catalogue contient des produits': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) && body.length > 0;
      } catch { return false; }
    },
  });

  if (!browseOk) {
    console.error(`[VU ${__VU}] Impossible de charger le catalogue : ${productsRes.status}`);
    return;
  }

  sleep(1); // Le client regarde les produits

  // ── Étape 2 : Choisir un produit et obtenir un variant valide ─────────────
  let variantId = null;
  try {
    const products = JSON.parse(productsRes.body);
    // On cherche un produit actif avec des variants en stock
    for (const product of products) {
      if (product.variants && product.variants.length > 0) {
        const v = product.variants.find(v => v.stock > 0);
        if (v) {
          variantId = v.id;
          break;
        }
      }
    }
  } catch (e) {
    console.error(`[VU ${__VU}] Erreur parsing catalogue: ${e}`);
    return;
  }

  if (!variantId) {
    console.warn(`[VU ${__VU}] Aucun variant disponible en stock — test ignoré`);
    return;
  }

  sleep(1); // Le client choisit son produit

  // ── Étape 3 : Simuler l'abandon de panier (optionnel, comme le frontend) ──
  const abandonPayload = JSON.stringify({
    customer_phone: PHONES[userIndex],
    customer_name: NAMES[userIndex],
    items: [{ variant_id: variantId, quantity: 1 }],
  });

  http.post(`${BASE_URL}/orders/abandoned`, abandonPayload, { headers });
  sleep(2); // Le client remplit le formulaire

  // ── Étape 4 : Passer la commande ──────────────────────────────────────────
  const orderPayload = JSON.stringify({
    customer_name:     NAMES[userIndex],
    customer_phone:    PHONES[userIndex],
    customer_city:     CITIES[userIndex % CITIES.length],
    customer_address:  '123 Rue des Roses',
    customer_quartier: QUARTIERS[userIndex % QUARTIERS.length],
    items: [
      { variant_id: variantId, quantity: 1 },
    ],
  });

  const orderStart = Date.now();
  const orderRes   = http.post(`${BASE_URL}/orders`, orderPayload, { headers });
  orderDuration.add(Date.now() - orderStart);

  const orderOk = check(orderRes, {
    'Commande créée (201)': (r) => r.status === 201,
    'Commande a un numéro': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.order_number && body.order_number.startsWith('ATH-');
      } catch { return false; }
    },
    'Total commande > 0': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.total_amount > 0;
      } catch { return false; }
    },
  });

  orderSuccess.add(orderOk);

  if (!orderOk) {
    console.error(`[VU ${__VU}] Commande échouée — Status: ${orderRes.status} — Body: ${orderRes.body.substring(0, 300)}`);
  } else {
    try {
      const body = JSON.parse(orderRes.body);
      console.log(`[VU ${__VU}] ✅ Commande ${body.order_number} placée — Total: ${body.total_amount} MAD`);
    } catch {}
  }

  sleep(1);
}
