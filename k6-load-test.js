import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuration du test de charge (Load Test)
export const options = {
  // On simule une montée en charge progressive
  stages: [
    { duration: '30s', target: 20 }, // Monte à 20 visiteurs pendant 30s
    { duration: '1m', target: 50 },  // Reste à 50 visiteurs pendant 1 min
    { duration: '30s', target: 0 },   // Redescend à 0
  ],
  thresholds: {
    // Les requêtes HTTP doivent répondre en moins de 1000ms dans 95% des cas
    http_req_duration: ['p(95)<1000'],
    // Moins de 1% d'erreurs tolérées
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'https://atharfragrances.ma';
const API_URL = 'https://api.atharfragrances.ma/api';

export default function () {
  // 1. L'utilisateur charge la page d'accueil (Frontend)
  const resHome = http.get(`${BASE_URL}/`);
  
  check(resHome, {
    'Page d accueil 200 OK': (r) => r.status === 200,
  });

  // Pause aléatoire entre 1 et 3 secondes comme un vrai humain
  sleep(Math.random() * 2 + 1);

  // 2. Le script frontend fait un appel à l'API pour récupérer les produits
  const resProducts = http.get(`${API_URL}/products`);
  
  check(resProducts, {
    'API Produits 200 OK': (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 1);

  // 3. Optionnel: l'utilisateur clique sur une collection (ex: Parfums Arabic)
  const resCollection = http.get(`${API_URL}/products?collection=parfums-arabic`);
  
  check(resCollection, {
    'API Collection 200 OK': (r) => r.status === 200,
  });

  sleep(1);
}
