import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

export default function ReproductorPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const canco = state?.canco
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!canco) return navigate("/recomanacions")
    const aud = new Audio(canco.preview)
    audioRef.current = aud
    aud.addEventListener("loadedmetadata", () => {
      setDuration(aud.duration)
    })
    aud.addEventListener("timeupdate", () => {
      setTime(aud.currentTime)
    })
    return () => {
      aud.pause()
      aud.src = ""
    }
  }, [canco, navigate])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  const fmt = sec => new Date(sec * 1000).toISOString().substr(14, 5)

  if (!canco) return null

  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-md bg-card text-card-foreground">
        <CardHeader>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted-foreground hover:underline mb-2"
          >
            <FiArrowLeft className="inline mr-1" />
            Tornar
          </button>
          <CardTitle>Now Playing</CardTitle>
          <CardDescription>{canco.name} — {canco.artist}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src={canco.image}
            alt={canco.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={0}
              max={duration}
              value={time}
              readOnly
              className="flex-1"
            />
            <div className="text-xs text-muted-foreground">
              {fmt(time)} / {fmt(duration)}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => {
            if (audioRef.current) audioRef.current.currentTime = 0
          }}>
            <SkipBack />
          </Button>
          <Button size="icon" className="bg-primary text-primary-foreground" onClick={togglePlay}>
            {playing ? <Pause /> : <Play />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => {
            if (audioRef.current) audioRef.current.currentTime = duration
          }}>
            <SkipForward />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
