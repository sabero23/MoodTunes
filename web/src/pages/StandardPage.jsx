import Header from "../components/Header";

export default function StandardPage() {
  const usuari = JSON.parse(localStorage.getItem("usuari"));
  return (
    <>
      <Header />
      <div className="main-content">
        <h2>Benvingut, {usuari.nom}</h2>
        <p>Aquesta és la zona per a usuaris <strong>standard</strong>.</p>
      </div>
    </>
  );
}
