export default function Navbar() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="font-bold">Hype</div>
      <nav className="flex gap-4">
        <a href="/">Accueil</a>
        <a href="/cart">Panier</a>
        <a href="/auth/login">Connexion</a>
      </nav>
    </header>
  );
}
