// src/pages/RecomanacionsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

export default function RecomanacionsPage() {
  const [recs, setRecs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("usuari"))?.token;
    fetch(`${import.meta.env.VITE_API_URL}/api/recomanacions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("No se pudieron obtener recomendaciones");
        return r.json();
      })
      .then((data) => setRecs(data.recomanacions))
      .catch((err) => {
        console.error(err);
        // aquí podrías mostrar un toast de error
      });
  }, []);

  if (recs.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No hi ha recomanacions per avui. Guarda un estat d’ànim primer!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      {recs.map((canco) => (
        <Card key={canco.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{canco.name}</CardTitle>
            <CardDescription>{canco.artist}</CardDescription>
          </CardHeader>
          <CardContent>
            {canco.image && (
              <img
                src={canco.image}
                alt={canco.name}
                className="w-full h-auto rounded-lg"
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={() => {
                // <––– Aquí sacas por consola el preview_url
                console.log("preview_url de la cançó:", canco.preview);

                navigate("/reproductor", { state: { canco } });
              }}
            >
              Reproduir
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open(canco.uri, "_blank", "noopener,noreferrer")
              }
            >
              Spotify
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
