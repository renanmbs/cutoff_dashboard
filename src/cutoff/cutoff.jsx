import "./cutoff.css";
import { useState, useEffect } from "react";
import { Tooltip } from "../tooltip/tooltip";
import { Contact } from "../contact/contact";

const warehouseLocations = {
  TX: { name: "Dallas - TX", tz: "America/Chicago", lat: 32.7976639402147, lon: -97.03247275120683 },
  NY: { name: "Ronkonkoma - NY", tz: "America/New_York", lat: 40.789462921604894, lon: -73.1232583 },
  NV: { name: "Sparks - NV", tz: "America/Los_Angeles", lat: 39.524531234552406, lon: -119.74491373467194 }
};

export function Cutoff() {
  const [region, setRegion] = useState("NY");
  const [closestInfo, setClosestInfo] = useState(null); // null = don't show anything
  const [localTime, setLocalTime] = useState(new Date());
  const [geoAllowed, setGeoAllowed] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setLocalTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoAllowed(true); // ✅ now we know it's allowed
          const { latitude, longitude } = pos.coords;
          let nearest = "NY";
          let shortest = Infinity;

          for (const [code, loc] of Object.entries(warehouseLocations)) {
            const dist = getDistance(latitude, longitude, loc.lat, loc.lon);
            if (dist < shortest) {
              shortest = dist;
              nearest = code;
            }
          }

          setRegion(nearest);
          setClosestInfo({ code: nearest, distance: Math.round(shortest) });
        },
        () => {
          setGeoAllowed(false);
          setClosestInfo(null);
        }
      );
    }
  }, []);


  const handleRegionChange = (e) => setRegion(e.target.value);

  function getTimeBgColor(cutoffStr, tz) {
    const [hours, minutes] = cutoffStr.split(":").map(Number);
    const nowStr = new Date().toLocaleString("en-US", { timeZone: tz });
    const now = new Date(nowStr);
    const cutoff = new Date(now);
    cutoff.setHours(hours, minutes, 0, 0);
    const diffMinutes = (cutoff - now) / 60000;
    if (diffMinutes <= 0) return "#ff4d4f";
    if (diffMinutes <= 60) return "#faad14";
    return "#52c41a";
  }

  const formatNote = (note) => {
    if (typeof note !== "string") return note;
    return note.replace(
      /(\d{1,2}:\d{2}\s*(AM|PM)?)(\s*\((EST|CST|PST)\))?/gi,
      "<strong>$1$3</strong>"
    );
  };

  if (!cards[region]) return <div>Loading...</div>;

  return (
    <div className="cutoff-page">
      <header className="banner">
        <h1>Cutoff Times Dashboard</h1>

        <div className="info">
          {geoAllowed === true && (
            <p>
              Your Local Time:{" "}
              <strong>
                {localTime.toLocaleTimeString([], {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </strong>
            </p>
          )}

          {geoAllowed === true && closestInfo && (
            <p>
              Closest warehouse detected:{" "}
              <strong>{warehouseLocations[closestInfo.code].name}</strong>
              {closestInfo.distance !== null && ` (${closestInfo.distance} miles away)`}
            </p>
          )}

          <div className="warehouse-selector">
            {Object.entries(warehouseLocations).map(([code, loc]) => (
              <label
                key={code}
                className={region === code ? "selected" : ""}
                style={{ marginRight: "3rem" }}
              >
                <input
                  type="radio"
                  value={code}
                  checked={region === code}
                  onChange={handleRegionChange}
                />
                {loc.name}
              </label>
            ))}

            {/* Gentle hint about allowing location */}
            {geoAllowed === false && (
              <p style={{ fontSize: "1.1rem", color: "#919191ff", marginTop: "0.5rem", fontStyle: "italic", fontWeight: "600" }}>
                For the best experience, allow your browser to detect your location.
              </p>
            )}
          </div>
        </div>

      </header>

      {/* REST OF YOUR UI UNTOUCHED */}
      <div className="cutoff-container">
        {cards[region].map(card => (
          <div key={card.id} className={`card ${card.id}`}>
            <h2>
              {card.tooltipItems ? (
                <Tooltip label={card.title} items={card.tooltipItems} />
              ) : (
                card.title
              )}
            </h2>

            {(card.cutoffs ?? [card.cutoff]).map((c, idx) => {
              const warehouseTime = new Date().toLocaleTimeString("en-US", {
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
                timeZone: warehouseLocations[region].tz
              });
              return (
                <div key={idx} className="time-block">
                  <p className="time" style={{ backgroundColor: getTimeBgColor(c, warehouseLocations[region].tz) }}>
                    {warehouseTime}
                  </p>
                </div>
              );
            })}

            <ul>
              {card.notes.map((note, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: formatNote(note) }} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h4><sup>*</sup>NO EXCEPTIONS UNLESS A MANAGER APPROVES</h4>
      <Contact />
    </div>
  );
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 0.621371;
}


// Full cards data
const cards = {
  NY: [
    {
      id: "ltl",
      title: "LTL Cutoff Time",
      tooltipItems: ["LTL shipping methods include:", "• A Duie Pyle", "• ABF", "• Old Dominion", "• FlatBed"],
      cutoff: "13:45",
      notes: [
        "Pending paperwork to Shipping Department by 1:45 PM (EST)",
        "At 1:45 PM (EST) - Report number of remaining skids to Shipping Department"
      ]
    },
    {
      id: "fed_up",
      title: "FedEx Ground & UPS Cutoff Time",
      cutoff: "16:00",
      notes: ["Pending paperwork to Shipping Department by 4:00 PM (EST)"]
    },
    {
      id: "fed_exp",
      title: "FedEx Express & Freight Cutoff Time",
      cutoffs: ["12:00"],
      notes: ["Pending paperwork to Shipping Department by 12:00 PM (EST)"]
    },
    {
      id: "cust_exp",
      title: "Customer Pickups Cutoff Time",
      cutoff: "16:30",
      notes: ["Pickups must be between 8:30 AM - 4:30 PM (EST)"]
    }
  ],
  TX: [
    {
      id: "ltl",
      title: "LTL Cutoff Time",
      tooltipItems: ["LTL shipping methods include:", "• A Duie Pyle", "• ABF", "• Old Dominion", "• FlatBed"],
      cutoff: "14:30",
      notes: [
        "Pending paperwork to Shipping Department by 2:30 PM (CST)",
        "At 2:30 PM (CST) - Report number of remaining skids to Shipping Department"
      ]
    },
    {
      id: "fed_up",
      title: "FedEx Cutoff Time",
      cutoff: "15:00",
      notes: ["Pending paperwork to Shipping Department by 3:00 PM (CST)"]
    },
    {
      id: "ups",
      title: "UPS & Freight Cutoff Time",
      cutoffs: ["15:00"],
      notes: ["Pending paperwork to Shipping Department by 3:00 PM (CST)"]
    },
    {
      id: "usps",
      title: "USPS Cutoff Time",
      cutoffs: ["11:00"],
      notes: ["Pending paperwork to Shipping Department by 11:00 AM (CST)"]
    },
    {
      id: "cust_exp",
      title: "Customer Pickups Cutoff Time",
      cutoff: "16:30",
      notes: ["Pickups must be between 8:30 AM - 4:30 PM (CST)"]
    }
  ],
  NV: [
    {
      id: "ltl",
      title: "LTL Cutoff Time",
      tooltipItems: ["LTL shipping methods include:", "• A Duie Pyle", "• ABF", "• Old Dominion", "• FlatBed"],
      cutoff: "13:30",
      notes: [
        "Pending paperwork to Shipping Department by 1:30 PM (PST)",
        "At 1:30 PM (PST) - Report number of remaining skids to Shipping Department"
      ]
    },
    {
      id: "fed_up",
      title: "FedEx Ground Cutoff Time",
      cutoff: "14:00",
      notes: ["Pending paperwork to Shipping Department by 2:00 PM (PST)"]
    },
    {
      id: "ups",
      title: "UPS & Freight Cutoff Time",
      cutoffs: ["14:00"],
      notes: ["Pending paperwork to Shipping Department by 2:00 PM (PST)"]
    },
    {
      id: "usps",
      title: "USPS Cutoff Time",
      cutoffs: ["14:00"],
      notes: ["Pending paperwork to Shipping Department by 2:00 PM (PST)"]
    },
    {
      id: "cust_exp",
      title: "Customer Pickups Cutoff Time",
      cutoff: "16:30",
      notes: ["Pickups must be between 8:30 AM - 4:30 PM (PST)"]
    }
  ]
};
