'use client';

import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Hype Market
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 pb-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Conditions d'utilisation</h1>
          
          <div className="bg-white rounded-lg p-8 shadow-sm prose prose-lg max-w-none">
            <h2 className="text-center font-bold text-2xl mb-2">CONDITIONS GÉNÉRALES D'UTILISATION ET DE VENTE</h2>
            <h3 className="text-center text-xl mb-1">HYPE MARKETPLACE</h3>
            <p className="text-center text-sm text-gray-600 mb-6">
              Dernière mise à jour : octobre 2025<br />
              Site officiel : www.hype-marketplace.shop<br />
              Email de contact : contact@hype-marketplace.shop
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold mb-2">📌 Important :</p>
              <p className="text-sm">
                En utilisant la plateforme Hype Marketplace, vous acceptez sans réserve l'ensemble des conditions énoncées ci-dessous. 
                Nous vous recommandons de les lire attentivement avant de créer un compte ou d'effectuer toute transaction.
              </p>
            </div>

            <h3>ARTICLE 1 – PRÉAMBULE ET DÉFINITIONS</h3>
            
            <h4>1.1 Présentation générale</h4>
            <p>
              Les présentes Conditions Générales d'Utilisation et de Vente (ci-après « Conditions » ou « CGU-V ») régissent l'accès, l'utilisation et les transactions effectuées sur la plateforme Hype Marketplace, accessible à l'adresse www.hype-marketplace.shop (ci-après « la Plateforme » ou « le Site »).
            </p>
            <p>
              Hype Marketplace est une marketplace en ligne basée en Côte d'Ivoire, spécialisée dans la mode africaine, les accessoires, la beauté et les produits artisanaux. La Plateforme met en relation des vendeurs (professionnels ou particuliers) et des acheteurs souhaitant acquérir des articles de qualité.
            </p>

            <h4>1.2 Définitions</h4>
            <ul>
              <li><strong>Utilisateur</strong> : Toute personne accédant à la Plateforme, qu'elle soit inscrite ou non.</li>
              <li><strong>Vendeur</strong> : Personne physique ou morale inscrite sur la Plateforme proposant des produits à la vente.</li>
              <li><strong>Acheteur</strong> : Utilisateur inscrit effectuant un achat sur la Plateforme.</li>
              <li><strong>Compte</strong> : Espace personnel sécurisé créé lors de l'inscription.</li>
              <li><strong>Produit</strong> : Tout article mis en vente par un Vendeur sur la Plateforme.</li>
              <li><strong>Transaction</strong> : Opération d'achat et de vente réalisée via la Plateforme.</li>
              <li><strong>Mobile Money</strong> : Service de paiement mobile utilisé pour les transactions (Orange Money, MTN Money, Moov Money, Wave).</li>
            </ul>

            <h4>1.3 Acceptation des conditions</h4>
            <p>
              L'utilisation de la Plateforme implique l'acceptation pleine, entière et sans réserve des présentes Conditions. En créant un compte, en naviguant sur le Site ou en effectuant une transaction, vous reconnaissez avoir pris connaissance de ces Conditions et vous engagez à les respecter.
            </p>
            <p>
              Si vous n'acceptez pas ces Conditions, nous vous demandons de ne pas utiliser la Plateforme.
            </p>
            
            <p className="text-sm italic text-gray-600">
              These Terms and Conditions govern access to and use of the Hype Marketplace platform. Hype Marketplace is an online marketplace based in Côte d'Ivoire, specializing in African fashion, accessories, beauty, and artisanal products. By using the Platform, users fully accept these Terms.
            </p>

            <h3>ARTICLE 2 – OBJET ET PORTÉE DES CONDITIONS</h3>
            
            <h4>2.1 Objet</h4>
            <p>
              Les présentes Conditions ont pour objet de définir les droits et obligations respectifs de Hype Marketplace, des Vendeurs et des Acheteurs dans le cadre de l'utilisation de la Plateforme et des transactions commerciales qui y sont effectuées.
            </p>
            <p>
              Elles constituent le contrat entre Hype Marketplace et ses utilisateurs. Toute utilisation de la Plateforme est subordonnée au respect de ces Conditions.
            </p>

            <h4>2.2 Portée</h4>
            <p>
              Ces Conditions s'appliquent à l'ensemble des services proposés par Hype Marketplace, notamment :
            </p>
            <ul>
              <li>La consultation des produits et des boutiques</li>
              <li>La création et la gestion de comptes utilisateurs</li>
              <li>La mise en vente de produits par les Vendeurs</li>
              <li>L'achat de produits par les Acheteurs</li>
              <li>Les services de paiement et de livraison</li>
              <li>Les fonctionnalités de communication (live shopping, chat, avis)</li>
              <li>Les services premium et options payantes</li>
            </ul>

            <p className="text-sm italic text-gray-600">
              These Terms define the rights and obligations of Hype Marketplace, Sellers, and Buyers. They apply to all services offered on the Platform including product browsing, account management, sales, purchases, payments, delivery, and premium features.
            </p>

            <h3>ARTICLE 3 – ACCÈS À LA PLATEFORME ET DISPONIBILITÉ</h3>
            
            <h4>3.1 Conditions d'accès</h4>
            <p>
              L'accès à la Plateforme est gratuit pour tout utilisateur disposant d'un accès Internet et d'un terminal compatible (ordinateur, smartphone, tablette). La navigation sur le Site ne nécessite pas de création de compte, toutefois certaines fonctionnalités sont réservées aux utilisateurs inscrits.
            </p>

            <h4>3.2 Fonctionnalités payantes</h4>
            <p>
              Certaines fonctionnalités avancées peuvent être soumises à des frais, notamment :
            </p>
            <ul>
              <li>Options de mise en avant de produits (500 FCFA/jour/produit)</li>
              <li>Placement privilégié dans les résultats de recherche</li>
              <li>Badges "Vendeur Vérifié" ou "Boutique Premium"</li>
              <li>Outils d'analyse et statistiques avancées pour les vendeurs</li>
              <li>Publicité ciblée sur la plateforme</li>
            </ul>

            <h4>3.3 Disponibilité et maintenance</h4>
            <p>
              Hype Marketplace s'efforce d'assurer l'accessibilité de la Plateforme 24h/24 et 7j/7. Toutefois, nous nous réservons le droit d'interrompre temporairement l'accès pour effectuer des opérations de maintenance, de mises à jour ou d'amélioration.
            </p>
            <p>
              En cas d'interruption prolongée ou de dysfonctionnement majeur, nous nous engageons à informer les utilisateurs dans les meilleurs délais via le Site ou par email.
            </p>

            <h4>3.4 Suspension et résiliation d'accès</h4>
            <p>
              Hype Marketplace se réserve le droit de suspendre ou de résilier l'accès de tout utilisateur en cas de :
            </p>
            <ul>
              <li>Non-respect des présentes Conditions</li>
              <li>Comportement frauduleux ou illicite</li>
              <li>Utilisation abusive de la Plateforme</li>
              <li>Publication de contenus inappropriés ou illégaux</li>
              <li>Plaintes répétées d'autres utilisateurs</li>
              <li>Impayés ou tentatives de fraude aux paiements</li>
            </ul>
            <p>
              La suspension ou la résiliation peut être temporaire ou définitive selon la gravité des manquements constatés.
            </p>
            
            <p className="text-sm italic text-gray-600">
              Access to the Platform is free for all users with Internet access. Certain premium features may be subject to fees. Hype Marketplace reserves the right to suspend or restrict access in case of violation of these Terms, fraudulent behavior, or misuse of the Platform.
            </p>

            <h3>ARTICLE 4 – CRÉATION DE COMPTE ET SÉCURITÉ</h3>
            
            <h4>4.1 Inscription obligatoire</h4>
            <p>
              Pour vendre ou acheter sur la Plateforme, l'inscription est obligatoire. La création de compte est gratuite et nécessite la fourniture d'informations personnelles telles que : nom, prénom, adresse email, numéro de téléphone et la création d'un mot de passe sécurisé.
            </p>

            <h4>4.2 Exactitude des informations</h4>
            <p>
              L'utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription. Toute fausse information ou usurpation d'identité entraînera la suspension immédiate du compte.
            </p>
            <p>
              L'utilisateur s'engage à mettre à jour ses informations personnelles en cas de changement (adresse, numéro de téléphone, email, etc.).
            </p>

            <h4>4.3 Sécurité du compte</h4>
            <p>
              Les identifiants de connexion (email et mot de passe) sont strictement personnels et confidentiels. L'utilisateur est seul responsable de leur conservation et de leur utilisation. En cas de perte, vol ou utilisation frauduleuse de ses identifiants, l'utilisateur doit immédiatement en informer Hype Marketplace via contact@hype-marketplace.shop.
            </p>
            <p>
              Nous recommandons vivement de :
            </p>
            <ul>
              <li>Utiliser un mot de passe complexe (lettres, chiffres, caractères spéciaux)</li>
              <li>Ne jamais partager ses identifiants avec des tiers</li>
              <li>Se déconnecter après chaque session sur un appareil partagé</li>
              <li>Activer la double authentification si disponible</li>
            </ul>

            <h4>4.4 Conditions d'âge</h4>
            <p>
              L'inscription sur la Plateforme est réservée aux personnes majeures (18 ans et plus) ou aux mineurs disposant de l'autorisation parentale. Hype Marketplace se réserve le droit de demander une preuve d'âge ou d'identité à tout moment.
            </p>

            <h4>4.5 Vérification des comptes</h4>
            <p>
              Hype Marketplace se réserve le droit de vérifier l'identité des utilisateurs, notamment des Vendeurs, en demandant des documents justificatifs (pièce d'identité, justificatif de domicile, certificat d'immatriculation pour les professionnels).
            </p>
            
            <p className="text-sm italic text-gray-600">
              Registration is required to sell or buy on the Platform. Users must provide accurate and up-to-date information. Login credentials are personal, confidential, and must not be shared. Users must be at least 18 years old or have parental authorization. Hype Marketplace may verify user identity at any time.
            </p>

            <h3>ARTICLE 5 – CONDITIONS APPLICABLES AUX VENDEURS</h3>
            
            <h4>5.1 Obligations générales des vendeurs</h4>
            <p>
              Le Vendeur s'engage à fournir des informations véridiques et complètes concernant son identité, ses produits, leurs caractéristiques et leurs prix. Il est entièrement responsable de la description, de la qualité, de la disponibilité et de la conformité de ses produits.
            </p>

            <h4>5.2 Publication et description des produits</h4>
            <p>
              Les Vendeurs doivent publier des descriptions précises de leurs produits, incluant :
            </p>
            <ul>
              <li>Nom du produit et marque (si applicable)</li>
              <li>Description détaillée et honnête</li>
              <li>Photos de qualité représentant fidèlement le produit</li>
              <li>Taille, couleur, matière et autres caractéristiques pertinentes</li>
              <li>Prix en FCFA (incluant ou excluant la livraison)</li>
              <li>État du produit (neuf, occasion, reconditionné)</li>
              <li>Délai de préparation avant expédition</li>
            </ul>

            <h4>5.3 Produits interdits</h4>
            <p>
              Il est strictement interdit de vendre sur la Plateforme :
            </p>
            <ul>
              <li>Produits contrefaits ou de marques non autorisées</li>
              <li>Produits illégaux ou dangereux</li>
              <li>Armes, munitions ou explosifs</li>
              <li>Médicaments sans autorisation</li>
              <li>Produits périmés ou non conformes aux normes sanitaires</li>
              <li>Contenus pornographiques ou inappropriés</li>
              <li>Articles volés ou d'origine douteuse</li>
            </ul>

            <h4>5.4 Prix et disponibilité</h4>
            <p>
              Le Vendeur fixe librement le prix de ses produits. Toutefois, il s'engage à pratiquer des prix justes et à ne pas modifier les prix après validation d'une commande. Le Vendeur doit s'assurer de la disponibilité des produits mis en ligne et retirer immédiatement toute annonce de produit épuisé.
            </p>

            <h4>5.5 Modalités de paiement et commission</h4>
            <ul>
              <li><strong>Paiement différé</strong> : Le paiement du produit n'est versé au Vendeur qu'après confirmation de la livraison au client.</li>
              <li><strong>Mode de paiement</strong> : Les paiements sont traités exclusivement par Mobile Money (Orange Money, MTN Money, Moov Money, Wave) via les comptes désignés par Hype Marketplace.</li>
              <li><strong>Commission de la plateforme</strong> : Hype Marketplace prélève une commission de 8% sur le prix de vente de chaque article vendu (hors frais de livraison).</li>
              <li><strong>Délai de versement</strong> : Les paiements sont effectués dans un délai de 48 à 72 heures après confirmation de livraison.</li>
            </ul>

            <h4>5.6 Options de mise en avant</h4>
            <p>
              Le Vendeur peut choisir de bénéficier d'une mise en avant payante de ses produits au tarif de <strong>500 FCFA par jour et par produit</strong>. Cette option permet d'améliorer la visibilité du produit dans les résultats de recherche et sur la page d'accueil.
            </p>

            <h4>5.7 Gestion de la livraison</h4>
            <p>
              Hype Marketplace gère intégralement la logistique et la livraison des produits vendus sur la Plateforme. Le Vendeur doit préparer les produits vendus dans un emballage approprié et les remettre au livreur désigné dans les délais convenus.
            </p>

            <h4>5.8 Service client et SAV</h4>
            <p>
              Le Vendeur s'engage à répondre dans un délai raisonnable aux questions des clients et à gérer les éventuelles réclamations ou retours de manière professionnelle.
            </p>

            <h4>5.9 Sanctions en cas de manquement</h4>
            <p>
              Le Vendeur est responsable de toute information erronée, produit non conforme ou comportement frauduleux. En cas de manquement grave ou répété, Hype Marketplace peut :
            </p>
            <ul>
              <li>Suspendre temporairement le compte vendeur</li>
              <li>Supprimer définitivement le compte</li>
              <li>Retenir les paiements en attente</li>
              <li>Engager des poursuites judiciaires si nécessaire</li>
            </ul>
            
            <p className="text-sm italic text-gray-600">
              Sellers must provide accurate information about their products and prices. Payment is made only after confirmed delivery. All transactions are processed via Mobile Money. Hype Marketplace charges an 8% commission. Sellers can opt for paid promotion (500 FCFA/day/product). Hype Marketplace manages delivery. Prohibited items include counterfeit goods, illegal products, and weapons. Sellers are responsible for any false information, and accounts may be suspended or deleted in case of violation.
            </p>

            <h3>ARTICLE 6 – CONDITIONS APPLICABLES AUX ACHETEURS</h3>
            
            <h4>6.1 Obligations générales des acheteurs</h4>
            <p>
              Les Acheteurs s'engagent à fournir des informations exactes et complètes lors de la passation de commande, notamment leur adresse de livraison, numéro de téléphone et coordonnées de paiement Mobile Money.
            </p>

            <h4>6.2 Passation de commande</h4>
            <p>
              Pour passer commande, l'Acheteur doit :
            </p>
            <ul>
              <li>Sélectionner les produits souhaités et les ajouter au panier</li>
              <li>Vérifier le récapitulatif de la commande (produits, quantités, prix)</li>
              <li>Renseigner l'adresse de livraison complète et exacte</li>
              <li>Choisir le mode de paiement (Mobile Money)</li>
              <li>Valider la commande en acceptant les conditions de vente</li>
            </ul>

            <h4>6.3 Paiement</h4>
            <p>
              Le paiement s'effectue exclusivement via Mobile Money (Orange Money, MTN Money, Moov Money, Wave). L'Acheteur doit honorer le paiement dans un délai de 24 heures après validation de la commande, faute de quoi celle-ci sera automatiquement annulée.
            </p>

            <h4>6.4 Frais de livraison</h4>
            <p>
              Les frais de livraison sont à la charge de l'Acheteur et sont calculés en fonction de la destination et du poids du colis. Le montant des frais de livraison est clairement indiqué avant la validation finale de la commande. Des offres promotionnelles (livraison gratuite) peuvent être proposées ponctuellement.
            </p>

            <h4>6.5 Réception et vérification</h4>
            <p>
              À la réception du colis, l'Acheteur est invité à vérifier :
            </p>
            <ul>
              <li>L'intégrité de l'emballage</li>
              <li>La conformité du produit avec la commande</li>
              <li>L'état du produit (absence de dommages apparents)</li>
            </ul>
            <p>
              En cas de problème manifeste, l'Acheteur doit immédiatement signaler l'anomalie au livreur et prendre des photos comme preuve.
            </p>

            <h4>6.6 Réclamations et retours</h4>
            <p>
              Toute réclamation concernant un produit non conforme, endommagé ou manquant doit être signalée dans les <strong>48 heures suivant la réception</strong> via le formulaire de contact ou par email à contact@hype-marketplace.shop. Au-delà de ce délai, aucune réclamation ne pourra être prise en compte.
            </p>
            <p>
              L'Acheteur doit fournir des preuves (photos, vidéos) et conserver le produit dans son emballage d'origine en attendant le traitement de la réclamation.
            </p>

            <h4>6.7 Droit de rétractation</h4>
            <p>
              Conformément à la législation ivoirienne, l'Acheteur dispose d'un délai de 7 jours à compter de la réception pour exercer son droit de rétractation, à condition que le produit soit retourné dans son état d'origine, non utilisé et dans son emballage intact. Les frais de retour sont à la charge de l'Acheteur, sauf en cas de produit défectueux ou non conforme.
            </p>
            
            <p className="text-sm italic text-gray-600">
              Buyers must provide accurate information and complete payments via Mobile Money. Delivery fees are borne by the buyer unless stated otherwise. Any complaint must be reported within 48 hours after receipt with photographic evidence. Buyers have a 7-day right of withdrawal for products returned in original condition.
            </p>

            <h3>ARTICLE 7 – LIVRAISON</h3>
            
            <h4>7.1 Zones de livraison</h4>
            <p>
              Hype Marketplace livre actuellement sur l'ensemble du territoire ivoirien, avec une priorité sur les grandes villes : Abidjan, Yamoussoukro, Bouaké, San-Pedro, Daloa, Korhogo, Man. Des frais supplémentaires peuvent s'appliquer pour les zones éloignées.
            </p>

            <h4>7.2 Délais de livraison</h4>
            <ul>
              <li><strong>Abidjan et communes</strong> : 24 à 48 heures</li>
              <li><strong>Grandes villes de l'intérieur</strong> : 3 à 5 jours ouvrés</li>
              <li><strong>Zones éloignées</strong> : 5 à 10 jours ouvrés</li>
            </ul>
            <p>
              Ces délais sont donnés à titre indicatif et peuvent varier en fonction des conditions météorologiques, de l'état des routes ou d'événements exceptionnels.
            </p>

            <h4>7.3 Suivi de livraison</h4>
            <p>
              L'Acheteur reçoit une notification par email et SMS à chaque étape clé de la livraison : confirmation de commande, expédition, en cours de livraison, livré. Un numéro de suivi peut être fourni pour suivre le colis en temps réel.
            </p>

            <h3>ARTICLE 8 – LIMITATION DE RESPONSABILITÉ</h3>
            
            <h4>8.1 Rôle d'intermédiaire</h4>
            <p>
              Hype Marketplace agit exclusivement en tant qu'intermédiaire technique entre les Vendeurs et les Acheteurs. La Plateforme ne peut être tenue responsable de :
            </p>
            <ul>
              <li>La qualité, la conformité ou l'authenticité des produits vendus</li>
              <li>Les litiges entre Vendeurs et Acheteurs concernant les produits</li>
              <li>Les retards de livraison indépendants de sa volonté</li>
              <li>Les dommages causés par une mauvaise utilisation des produits</li>
              <li>Les pertes ou dommages résultant d'informations erronées fournies par les utilisateurs</li>
            </ul>

            <h4>8.2 Disponibilité de la Plateforme</h4>
            <p>
              Hype Marketplace ne peut garantir un accès ininterrompu à la Plateforme. La responsabilité de Hype Marketplace ne saurait être engagée en cas de :
            </p>
            <ul>
              <li>Pannes techniques temporaires ou maintenance programmée</li>
              <li>Interruptions de service liées à un cas de force majeure</li>
              <li>Problèmes de connexion Internet de l'utilisateur</li>
              <li>Attaques informatiques ou intrusions malveillantes</li>
            </ul>

            <h4>8.3 Contenu généré par les utilisateurs</h4>
            <p>
              Hype Marketplace n'est pas responsable du contenu publié par les utilisateurs (descriptions, photos, avis) et se réserve le droit de modérer, modifier ou supprimer tout contenu inapproprié, illégal ou contraire aux présentes Conditions.
            </p>

            <h3>ARTICLE 9 – PROPRIÉTÉ INTELLECTUELLE</h3>
            
            <h4>9.1 Droits de Hype Marketplace</h4>
            <p>
              L'ensemble des éléments constituant la Plateforme (design, structure, graphismes, logos, textes, images, sons, vidéos, code source) sont la propriété exclusive de Hype Marketplace et sont protégés par les lois sur la propriété intellectuelle en vigueur en Côte d'Ivoire et internationalement.
            </p>

            <h4>9.2 Interdiction de reproduction</h4>
            <p>
              Toute reproduction, représentation, modification, publication, adaptation totale ou partielle des éléments de la Plateforme, par quelque moyen que ce soit, est strictement interdite sans l'autorisation écrite préalable de Hype Marketplace.
            </p>

            <h4>9.3 Contenu des utilisateurs</h4>
            <p>
              En publiant du contenu sur la Plateforme (photos, descriptions, avis), l'utilisateur concède à Hype Marketplace une licence non exclusive, gratuite et mondiale pour utiliser, reproduire, modifier et diffuser ce contenu dans le cadre de l'exploitation de la Plateforme.
            </p>
            
            <p className="text-sm italic text-gray-600">
              All elements of the Platform (design, texts, images, logos, source code) are the exclusive property of Hype Marketplace and protected by intellectual property laws. Any unauthorized reproduction is strictly prohibited. Users grant Hype Marketplace a non-exclusive license to use content they publish on the Platform.
            </p>

            <h3>ARTICLE 10 – PROTECTION DES DONNÉES PERSONNELLES</h3>
            
            <h4>10.1 Collecte des données</h4>
            <p>
              Hype Marketplace collecte et traite les données personnelles des utilisateurs (nom, prénom, email, téléphone, adresse) dans le respect de la réglementation ivoirienne sur la protection des données.
            </p>

            <h4>10.2 Utilisation des données</h4>
            <p>
              Les données collectées sont utilisées pour :
            </p>
            <ul>
              <li>La gestion des comptes utilisateurs</li>
              <li>Le traitement et le suivi des commandes</li>
              <li>L'amélioration des services de la Plateforme</li>
              <li>L'envoi de communications marketing (avec consentement)</li>
              <li>La prévention de la fraude et la sécurité</li>
            </ul>

            <h4>10.3 Droits des utilisateurs</h4>
            <p>
              Conformément à la loi, les utilisateurs disposent d'un droit d'accès, de rectification, de suppression et d'opposition concernant leurs données personnelles. Pour exercer ces droits, contactez-nous à : contact@hype-marketplace.shop.
            </p>
            <p>
              Pour plus de détails, consultez notre <Link href="/privacy" className="text-blue-600 underline">Politique de Confidentialité</Link>.
            </p>

            <h3>ARTICLE 11 – MODIFICATION DES CONDITIONS</h3>
            
            <p>
              Hype Marketplace se réserve le droit de modifier les présentes Conditions à tout moment, notamment pour s'adapter aux évolutions légales, réglementaires ou techniques. Les nouvelles dispositions prennent effet dès leur publication sur la Plateforme.
            </p>
            <p>
              Les utilisateurs sont invités à consulter régulièrement cette page. La poursuite de l'utilisation de la Plateforme après modification vaut acceptation des nouvelles Conditions. En cas de désaccord, l'utilisateur est libre de cesser d'utiliser la Plateforme.
            </p>
            
            <p className="text-sm italic text-gray-600">
              Hype Marketplace reserves the right to modify these Terms at any time. New provisions take effect upon publication. Users are advised to regularly check this page. Continued use of the Platform constitutes acceptance of the modified Terms.
            </p>

            <h3>ARTICLE 12 – RÈGLEMENT DES LITIGES ET MÉDIATION</h3>
            
            <h4>12.1 Règlement à l'amiable</h4>
            <p>
              En cas de litige entre un utilisateur et Hype Marketplace, nous encourageons vivement les parties à chercher une solution amiable avant toute procédure judiciaire. L'utilisateur peut contacter notre service client via contact@hype-marketplace.shop.
            </p>

            <h4>12.2 Médiation</h4>
            <p>
              Si aucune solution amiable n'est trouvée dans un délai raisonnable (30 jours), les parties peuvent recourir à une procédure de médiation auprès d'un médiateur agréé.
            </p>

            <h3>ARTICLE 13 – LOI APPLICABLE ET JURIDICTION COMPÉTENTE</h3>
            
            <p>
              Les présentes Conditions Générales d'Utilisation et de Vente sont régies par les lois de la République de Côte d'Ivoire. En cas de litige et à défaut de résolution amiable, les tribunaux compétents d'Abidjan seront exclusivement compétents, nonobstant pluralité de défendeurs ou appel en garantie.
            </p>
            
            <p className="text-sm italic text-gray-600">
              These Terms are governed by the laws of the Republic of Côte d'Ivoire. In case of dispute, the competent courts of Abidjan shall have exclusive jurisdiction. We encourage parties to seek amicable resolution through our customer service before any legal action.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg mt-8">
              <h4 className="font-bold mb-3">📞 CONTACT ET ASSISTANCE</h4>
              <p className="mb-2">
                Pour toute question concernant ces Conditions ou l'utilisation de la Plateforme, contactez-nous :
              </p>
              <ul className="list-none">
                <li><strong>Email :</strong> contact@hype-marketplace.shop</li>
                <li><strong>Site web :</strong> www.hype-marketplace.shop</li>
                <li><strong>Adresse :</strong> Abidjan, Côte d'Ivoire</li>
                <li><strong>Disponibilité :</strong> Lundi - Samedi, 8h - 18h</li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 mt-8 text-center border-t pt-4">
              Dernière mise à jour : Janvier 2025
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
