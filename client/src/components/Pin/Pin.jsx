import { Marker, Popup } from "react-leaflet";
import "./Pin.scss";
import { Link } from "react-router-dom";
import "../leafletIcons";
import "../../lib/LeafletIcons";

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <img
            src={item.images[0] ? item.images[0] : "/fallback-image.png"}
            alt={item.title}
            className="popupImage"
          />
          <div className="textContainer">
            <Link to={`/${item._id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>₹ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
