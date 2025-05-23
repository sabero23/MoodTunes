import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    const token = localStorage.getItem("token");
    try {
      // 1) playlist info
      const resP = await fetch(`http://localhost:4000/playlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resP.ok) throw new Error();
      const { playlist: pl } = await resP.json();

      // 2) playlist items
      const resI = await fetch(`http://localhost:4000/playlists/${id}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resI.ok) throw new Error();
      const { items: its } = await resI.json();

      setPlaylist(pl);
      setItems(its);
    } catch {
      toast.error("Error carregant playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) return null;
  if (!playlist) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-[#0b132b] dark:to-[#1c2541]">
      <Header />
      <div className="pt-20 px-6 pb-10">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{playlist.nom}</CardTitle>
            {playlist.descripcio && (
              <p className="text-sm text-muted-foreground mt-1">
                {playlist.descripcio}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No hi ha cançons.
              </p>
            ) : (
              <ul className="space-y-3">
                {items.map((it) => (
                  <li
                    key={it.inserted_at}
                    className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800"
                  >
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{it.nom_canco}</p>
                      <p className="text-sm text-muted-foreground">
                        {it.artista}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://open.spotify.com/track/${it.canco_id}`,
                          "_blank"
                        )
                      }
                    >
                      Veure
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground text-right">
             {items.length} cançó{items.length !== 1 && "es"}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
