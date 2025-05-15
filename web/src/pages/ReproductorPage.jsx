// src/pages/ReproductorPage.jsx
import { Button } from "../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "../components/ui/card"
import { BorderBeam } from "../components/magicui/border-beam"

import { Play, SkipBack, SkipForward } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function ReproductorPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [canco, setCanco] = useState(null);

    useEffect(() => {
        if (location.state?.canco) {
            setCanco(location.state.canco);
        } else {
            navigate("/");
        }
    }, [location, navigate]);

    if (!canco) return null;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
            <div className="absolute top-4 left-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-medium hover:underline"
                >
                    <FiArrowLeft /> Tornar
                </button>
            </div>

            <Card className="relative w-[350px] overflow-hidden">
                <CardHeader>
                    <CardTitle>Now Playing</CardTitle>
                    <CardDescription>{canco.nom_canco} - {canco.artista}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-48 w-48 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                        <div className="h-1 w-full rounded-full bg-secondary">
                            <div className="h-full w-1/3 rounded-full bg-primary" />
                        </div>
                        <div className="flex w-full justify-between text-sm text-muted-foreground">
                            <span>0:00</span>
                            <span>3:30</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <SkipBack className="size-4" />
                    </Button>
                    <Button size="icon" className="rounded-full">
                        <Play className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                        <SkipForward className="size-4" />
                    </Button>
                </CardFooter>
                <BorderBeam duration={6} size={400} className="from-transparent via-red-500 to-transparent" />
                <BorderBeam duration={6} delay={3} size={400} className="from-transparent via-blue-500 to-transparent" />
            </Card>
        </div>
    );
}
