import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "à l'instant";
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

function ArticleImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className="article-no-img">⛩</div>;
  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
}

const EMPTY_FORM = { title: "", content: "", coverImage: "", tags: "" };

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "new";

  useEffect(() => {
    setLoading(true);
    api.get(`/articles?sort=${sort === "popular" ? "popular" : "new"}`)
      .then((res) => { setArticles(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sort]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
      const res = await api.post("/articles", { ...form, tags });
      setArticles([res.data, ...articles]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/articles/${id}`);
    setArticles(articles.filter(a => a._id !== id));
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          {sort === "popular" ? "Tendances" : "Nouveautés"}
        </h1>
        {user && (
          <button className="btn-add-inline" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Annuler" : "+ Écrire un article"}
          </button>
        )}
      </div>

      {showForm && (
        <form className="article-form" onSubmit={handleSubmit}>
          <input
            placeholder="Titre de l'article"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="URL de l'image de couverture"
            value={form.coverImage}
            onChange={e => setForm({ ...form, coverImage: e.target.value })}
          />
          <input
            placeholder="Tags (séparés par des virgules : Naruto, Shounen...)"
            value={form.tags}
            onChange={e => setForm({ ...form, tags: e.target.value })}
          />
          <textarea
            placeholder="Contenu de l'article..."
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            rows={8}
            required
          />
          <button className="btn-red" type="submit" disabled={submitting}>
            {submitting ? "Publication..." : "Publier"}
          </button>
        </form>
      )}

      {articles.length === 0 && (
        <p className="empty">Aucun article pour le moment. Connecte-toi pour en écrire un !</p>
      )}

      <div className="articles-grid">
        {articles.map((article, i) => (
          <div key={article._id} className={`article-card${i === 0 ? " article-featured" : ""}`}>
            <Link to={`/articles/${article._id}`} className="article-link">
              <div className="article-img-wrap">
                <ArticleImage src={article.coverImage} alt={article.title} />
                {article.tags?.[0] && (
                  <span className="article-badge">{article.tags[0]}</span>
                )}
              </div>
              <div className="article-body">
                {article.tags?.length > 0 && (
                  <div className="article-tags">
                    {article.tags.slice(0, 3).map(t => (
                      <span key={t} className="article-tag">{t}</span>
                    ))}
                  </div>
                )}
                <h2 className="article-title">{article.title}</h2>
                <p className="article-excerpt">
                  {article.content.slice(0, i === 0 ? 200 : 100)}
                  {article.content.length > (i === 0 ? 200 : 100) ? "..." : ""}
                </p>
                <div className="article-footer">
                  <span className="article-meta">
                    @{article.author?.username} · {timeAgo(article.createdAt)}
                  </span>
                  <span className="article-read">Lire →</span>
                </div>
              </div>
            </Link>
            {user && article.author?._id === user.userId && (
              <button className="article-delete" onClick={() => handleDelete(article._id)}>✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
