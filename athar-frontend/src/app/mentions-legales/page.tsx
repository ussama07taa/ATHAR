import LegalPage from '@/components/legal/LegalPage';

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions Légales"
      sections={[
        { title: 'Éditeur', content: 'Athar — Maison de Parfums Marocains. Siège : Tanger, Maroc. Email : contact@athar.ma' },
        { title: 'Hébergement', content: 'Le site est hébergé par un prestataire conforme aux normes de sécurité en vigueur.' },
        { title: 'Propriété intellectuelle', content: 'L\'ensemble du contenu du site (textes, images, logo, fragrances) est la propriété exclusive d\'Athar. Toute reproduction est interdite sans autorisation.' },
        { title: 'Responsabilité', content: 'Athar s\'efforce d\'assurer l\'exactitude des informations publiées. Toutefois, des erreurs peuvent survenir. Athar ne saurait être tenu responsable des dommages liés à l\'utilisation du site.' },
      ]}
    />
  );
}
