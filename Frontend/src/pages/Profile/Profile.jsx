import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Profile.css";

export default function Profile() {
  return (
    <>
      <Header />
      <main className="profile-page">
        <section className="profile-shell">
          <h1>Profile</h1>
          <p>Your profile page is ready for customization.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
