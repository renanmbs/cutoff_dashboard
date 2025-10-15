import "./contact.css";
import { MdEmail, MdPhone } from "react-icons/md";

export function Contact() {
  const contacts = [
    {
      location: "New York",
      email: "nyshipping@monarchmetal.com",
      phone: "+1 (631)-750-3000 Ext. 129"
    },
    {
      location: "Texas",
      email: "tshaw@monarchmetal.com",
      phone: "+1 (631)-750-3000 Ext. 148"
    },
    {
      location: "Reno",
      email: "nvshipping@monarchmetal.com",
      phone: "+1 (631)-750-3000 Ext. 127"
    }
  ];

  return (

    <>
      <div className="contact-container">
        <h2>Contact The Shipping Department</h2>
        <p>If you have any questions or need assistance, please reach out to our shipping team:</p>

        <div className="contact-grid">
          {contacts.map((c, idx) => (
            <div key={idx} className="contact-location">
              <h3>{c.location}</h3>
              <ul>
                <li>
                  <MdEmail size={24} color="rgb(179,0,0)" aria-hidden="true" />
                  <a href={`mailto:${c.email}`} aria-label={`Email ${c.location} Shipping Department`}>
                    {c.email}
                  </a>
                </li>
                {c.phone && (
                  <li>
                    <MdPhone size={24} color="rgb(179,0,0)" aria-hidden="true" />
                    <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} aria-label={`Call ${c.location} Shipping Department`}>
                      {c.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

      </div>

      <div className="desc">
        <p>Description</p>
        <ul>
          <li><span className="gr">Green:</span> More than 1 hour to cutoff</li>
          <li><span className="yel">Yellow:</span> 1 hour or less to cutoff</li>
          <li><span className="red">Red:</span> Cutoff time has passed</li>
        </ul>
      </div>

    </>
  );
}
