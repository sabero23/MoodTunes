import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import MoodSelectorMagic from "../components/MoodSelectorMagic"

export default function PremiumPage() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState("")
  const [spotifyLinked, setSpotifyLinked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    const nombreGuardado = localStorage.getItem("nombre")
    if (!token || !email) return navigate("/login")

    setNombre(nombreGuardado || "Usuari")

    fetch("/usuarios/info", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.spotify_refresh_token) setSpotifyLinked(true)
      })
      .catch(() => {
        // idem
      })
  }, [navigate])

  const loginSpotify = () => {
    const email = localStorage.getItem("email")
    const token = localStorage.getItem("token")
    if (!email || !token) return

    // redirigeix a l’endpoint backend
    window.location.href = `/auth/spotify?email=${email}`
  }

  return (
    <div className="flex items-center justify-center min-h-full bg-background text-foreground">
      <Card className="max-w-md w-full p-6 space-y-6 bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Benvingut, <span className="text-primary">{nombre}</span>
          </CardTitle>
        </CardHeader>

        {!spotifyLinked ? (
          <CardContent className="space-y-4 text-center">
            <p className="text-lg text-muted-foreground font-semibold">
              Abans d'utilitzar el servei,<br />
              has de vincular el teu compte Spotify
            </p>
          </CardContent>
        ) : (
          <CardContent>
            <MoodSelectorMagic />
          </CardContent>
        )}

        {!spotifyLinked && (
          <CardFooter className="text-center">
            <Button
              onClick={loginSpotify}
              className="bg-green-500 hover:bg-green-600 text-white w-full"
            >
              Inicia sessió amb Spotify
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
