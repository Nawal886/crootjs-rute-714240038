
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.8/element.js";

const statusId = "status";

const peta = L.map("peta");

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(peta);

async function tampilkanRute() {
  try {
    const respons = await fetch("./data/OTW%20kampus.geojson");

    if (!respons.ok) {
      throw new Error("File GeoJSON tidak ditemukan.");
    }

    const geojson = await respons.json();

    const layer = L.geoJSON(geojson, {
      filter: function (feature) {
        return feature.geometry &&
          (feature.geometry.type === "LineString" ||
           feature.geometry.type === "MultiLineString");
      },
      style: function () {
        return {
          color: "blue",
          weight: 6,
          opacity: 0.85
        };
      },
      onEachFeature: function (feature, layer) {
        const nama = feature.properties?.nama ||
                     feature.properties?.Gedung ||
                     "Rute kos ke kampus";

        layer.bindPopup(nama);
      }
    }).addTo(peta);

    if (layer.getLayers().length > 0) {
      peta.fitBounds(layer.getBounds(), { padding: [20, 20] });
      setInner(statusId, "Rute berhasil ditampilkan.");
    } else {
      peta.setView([-6.8737, 107.5755], 16);
      setInner(
        statusId,
        "Tidak ditemukan garis LineString. Periksa data GeoJSON kamu."
      );
    }
  } catch (error) {
    console.error(error);
    setInner(statusId, "Gagal memuat GeoJSON. Periksa nama dan lokasi file.");
  }
}

tampilkanRute();
