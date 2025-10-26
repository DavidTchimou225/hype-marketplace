export default function LoginPage() {
  return (
    <section className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Connexion</h2>
      <form className="mt-4 space-y-3">
        <input className="border p-2 w-full" placeholder="Email" />
        <input className="border p-2 w-full" type="password" placeholder="Mot de passe" />
        <button className="border px-4 py-2">Se connecter</button>
      </form>
    </section>
  );
}
