import LegalPage from '@/components/legal/LegalPage';

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de Confidentialité"
      sections={[
        { title: 'Données collectées', content: 'Nous collectons les données nécessaires à la commande : nom, téléphone, adresse de livraison, email (newsletter). Ces données ne sont jamais vendues à des tiers.' },
        { title: 'Utilisation', content: 'Vos données servent uniquement au traitement de vos commandes, à la livraison et à l\'envoi de communications Athar si vous y avez consenti.' },
        { title: 'Conservation', content: 'Les données de commande sont conservées 3 ans à des fins comptables. Les abonnés newsletter peuvent se désinscrire à tout moment.' },
        { title: 'Vos droits', content: 'Vous pouvez demander l\'accès, la modification ou la suppression de vos données en nous contactant à contact@atharfragrances.ma.' },
        { title: 'Cookies', content: 'Le site utilise un cookie de panier (localStorage) pour mémoriser votre sélection. Aucun cookie publicitaire tiers n\'est utilisé actuellement.' },
      ]}
    />
  );
}
