// src/components/PlaylistDetailModal.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function PlaylistDetailModal({ playlist, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `http://localhost:4000/playlists/${playlist.id}/items`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error();
        const { items: its } = await res.json();
        setItems(its);
      } catch {
        toast.error("❌ Error carregant cançons de la playlist");
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, [playlist.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{playlist.nom}</CardTitle>
            <button onClick={onClose} className="text-sm text-muted-foreground hover:underline">Tancar</button>
          </div>
          {playlist.descripcio && (
            <p className="text-sm text-muted-foreground mt-1">{playlist.descripcio}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p>Carregant...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground">No hi ha cançons.</p>
          ) : (
            items.map((it) => (
              <div key={it.inserted_at} className="flex items-center gap-4">
                <img src={it.image} alt={it.nom_canco} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{it.nom_canco}</p>
                  <p className="text-sm text-muted-foreground">{it.artista}</p>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => window.open(`https://open.spotify.com/track/${it.canco_id}`, "_blank")}
                >
                  Veure
                </Button>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <span className="text-sm text-muted-foreground">
             {items.length} cançó{items.length !== 1 && "es"}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
