import Header from "../components/Header";
import "../pages/Dashboard.css";

export default function BasePage({ rol }) {
    return (
        <div className="dashboard-container">
            <Header />
            <main className="dashboard-main">
                const usuari = JSON.parse(localStorage.getItem("usuari"));
                <h1 className="dashboard-title">Benvingut, {usuari?.nom || rol}!</h1>
                <p className="dashboard-subtitle">
                    Aquesta és la teva àrea personal de MoodTunes.
                </p>
                {/* Aquí pots afegir més components segons el rol */}
            </main>
        </div>
    );
}
