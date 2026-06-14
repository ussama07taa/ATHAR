import LegalPage from '@/components/legal/LegalPage';

export default function CgvPage() {
  return (
    <LegalPage
      title="Conditions Générales de Vente"
      sections={[
        { title: 'Objet', content: 'Les présentes CGV régissent les ventes de parfums Athar sur le site athar.ma. Toute commande implique l\'acceptation sans réserve des présentes conditions.' },
        { title: 'Produits', content: 'Les produits proposés sont des créations Athar. Les photos sont non contractuelles. Les prix sont indiqués en MAD TTC.' },
        { title: 'Commande', content: 'La commande est validée après confirmation par notre équipe par téléphone ou WhatsApp. Nous nous réservons le droit d\'annuler toute commande en cas de stock insuffisant.' },
        { title: 'Paiement', content: 'Le paiement s\'effectue à la livraison (COD) en espèces. Le paiement par carte bancaire sera proposé prochainement.' },
        { title: 'Livraison', content: 'Livraison partout au Maroc. Gratuite à partir de 500 MAD. En dessous, des frais de 35 MAD s\'appliquent. Délais : 24h à Tanger, 48h grandes villes, 3-4 jours ailleurs.' },
        { title: 'Rétractation', content: 'Conformément à la loi marocaine, les produits descellés ne peuvent être retournés pour des raisons d\'hygiène. En cas de produit défectueux, contactez-nous sous 48h.' },
      ]}
    />
  );
}
