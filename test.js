// Frontend React (Vite + TailwindCSS)

import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [iosUrl, setIosUrl] = useState("");
  const [androidUrl, setAndroidUrl] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [links, setLinks] = useState([]);

  const api = "https://your-backend-url.com/api"; // à remplacer par ton backend

  const login = async () => {
    const res = await axios.post(`${api}/auth/login`, { email, password });
    setToken(res.data.token);
  };

  const register = async () => {
    await axios.post(`${api}/auth/register`, { email, password });
    login();
  };

  const createLink = async () => {
    const res = await axios.post(
      `${api}/links/create`,
      { ios_url: iosUrl, android_url: androidUrl, web_url: webUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLinks([...links, res.data]);
  };

  const fetchLinks = async () => {
    const res = await axios.get(`${api}/links/my-links`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLinks(res.data);
  };

  useEffect(() => {
    if (token) fetchLinks();
  }, [token]);

  if (!token)
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">Connexion</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="border p-2 w-full mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={login} className="bg-blue-500 text-white p-2 rounded">
            Se connecter
          </button>
          <button onClick={register} className="bg-gray-500 text-white p-2 rounded">
            S'inscrire
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Créer un lien intelligent</h2>
      <div className="grid grid-cols-1 gap-2 mb-4">
        <input
          type="text"
          placeholder="URL iOS"
          className="border p-2"
          onChange={(e) => setIosUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL Android"
          className="border p-2"
          onChange={(e) => setAndroidUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL Web par défaut"
          className="border p-2"
          onChange={(e) => setWebUrl(e.target.value)}
        />
        <button onClick={createLink} className="bg-green-500 text-white p-2 rounded">
          Créer le lien
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Mes liens</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.id} className="border p-2 rounded">
            <div><strong>Slug:</strong> {link.slug}</div>
            <div><strong>Clics:</strong> {link.click_count}</div>
            <div>
              <a
                href={`/r/${link.slug}`}
                className="text-blue-600 underline"
                target="_blank"
              >
                Voir le lien
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
