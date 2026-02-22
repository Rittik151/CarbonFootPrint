import DigitalWatch from "../pages/DigitalWatch";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-layout">
        <div className="footer-text">
          <p>Helping you make a measurable difference for our planet.</p>
        </div>
        <div className="footer-clock-button">
          <DigitalWatch isButton={true} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
