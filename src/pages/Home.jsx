import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Football Lineup Builder ⚽</h1>
      <p className="mb-8">Créez votre 11 de rêve facilement.</p>
      
      <Link to="/builder" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Commencer une compo
      </Link>
    </div>
  );
}