import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// --------------------------------------------------
// MAP CENTER
// --------------------------------------------------

const INDIA_CENTER = [22.9734, 78.6569];


// --------------------------------------------------
// MAP VIEW
// --------------------------------------------------

function MapView({ claims = [] }) {

  return (
    <div className="map-wrapper">

      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        scrollWheelZoom={true}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
        }}
      >

        {/* OpenStreetMap */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* CLAIM MARKERS */}

        {claims.map((claim) => {

          // Ignore claims without coordinates
          if (
            claim.latitude === null ||
            claim.longitude === null ||
            claim.latitude === undefined ||
            claim.longitude === undefined
          ) {
            return null;
          }

          return (

            <Marker
              key={claim.claim_id}
              position={[
                Number(claim.latitude),
                Number(claim.longitude),
              ]}
            >

              <Popup>

                <div className="claim-popup">

                  <h3>
                    {claim.claim_id}
                  </h3>

                  <div className="popup-row">
                    <strong>State:</strong>{" "}
                    {claim.state}
                  </div>

                  <div className="popup-row">
                    <strong>District:</strong>{" "}
                    {claim.district}
                  </div>

                  <div className="popup-row">
                    <strong>Claim Type:</strong>{" "}
                    {claim.claim_type}
                  </div>

                  <div className="popup-row">
                    <strong>Claimed Area:</strong>{" "}
                    {claim.claimed_area} acres
                  </div>

                  <div className="popup-row">
                    <strong>Recorded Area:</strong>{" "}
                    {claim.recorded_area} acres
                  </div>

                  <div className="popup-row">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`popup-status ${
                        claim.status?.toLowerCase()
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>

                  <div className="popup-row">
                    <strong>Location:</strong>{" "}
                    {Number(claim.latitude).toFixed(4)},{" "}
                    {Number(claim.longitude).toFixed(4)}
                  </div>

                </div>

              </Popup>

            </Marker>

          );

        })}

      </MapContainer>

    </div>
  );
}

export default MapView;