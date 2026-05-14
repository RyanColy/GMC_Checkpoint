import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./ArticleDetail.css";

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "à l'instant";
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", coverImage: "", tags: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/articles/${id}`)
      .then(res => {
        setArticle(res.data);
        setForm({
          title: res.data.title,
          content: res.data.content,
          coverImage: res.data.coverImage || "",
          tags: res.data.tags?.join(", ") || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const isAuthor = user && article?.author?._id === user.userId;

  const handleDelete = async () => {
    if (!window.confirm("Supprimer cet article ?")) return;
    await api.delete(`/articles/${id}`);
    navigate("/");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
      const res = await api.put(`/articles/${id}`, { ...form, tags });
      setArticle(res.data);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div><Navbar /><div className="loading">Chargement...</div></div>;
  if (!article) return <div><Navbar /><div className="loading">Article introuvable.</div></div>;

  return (
    <div className="article-detail-page">
      <Navbar />

      {article.coverImage && !editing && (
        <div className="article-hero">
          <img src={article.coverImage} alt={article.title} />
          <div className="article-hero-gradient" />
        </div>
      )}

      <div className="article-detail-body">
        <Link to="/" className="article-back">← Retour</Link>

        {/* ── Vue éditeur : formulaire de modification ── */}
        {editing ? (
          <form className="edit-form" onSubmit={handleSave}>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Titre"
              required
            />
            <input
              value={form.coverImage}
              onChange={e => setForm({ ...form, coverImage: e.target.value })}
              placeholder="URL de la cover"
            />
            <input
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="Tags (séparés par des virgules)"
            />
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={12}
              required
            />
            <div className="edit-actions">
              <button className="btn-red" type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button className="btn-outline" type="button" onClick={() => setEditing(false)}>
                Annuler
              </button>
            </div>
          </form>
        ) : (
          /* ── Vue lecture (visiteur + éditeur) ── */
          <>
            {article.tags?.length > 0 && (
              <div className="article-detail-tags">
                {article.tags.map(t => <span key={t} className="article-tag">{t}</span>)}
              </div>
            )}

            <h1 className="article-detail-title">{article.title}</h1>

            <div className="article-detail-meta">
              <span>Par <strong>@{article.author?.username}</strong></span>
              <span>·</span>
              <span>{timeAgo(article.createdAt)}</span>
              <span>·</span>
              <span>{article.views} vue{article.views !== 1 ? "s" : ""}</span>

              {/* ── Boutons réservés à l'auteur ── */}
              {isAuthor && (
                <div className="editor-actions">
                  <button className="btn-edit" onClick={() => setEditing(true)}>
                    ✎ Modifier
                  </button>
                  <button className="btn-delete-article" onClick={handleDelete}>
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            <div className="article-detail-content">
              {article.content.split("\n").map((p, i) =>
                p.trim() ? <p key={i}>{p}</p> : <br key={i} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
