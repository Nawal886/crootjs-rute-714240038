
import {
    createMap,
    addGeoJSON,
    fitMap,
    getGeoJSON
  } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.js";
  
  import {
    findRoute
  } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/georoute.js";
  
  import {
    setInner
  } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/element.js";
  
  createMap("peta", {
    center: [107.5755, -6.8737],
    zoom: 16
  });
  
  getGeoJSON("./data/OTW%20kampus.geojson", (response) => {
    if (!response.data) {
      setInner("status", "GeoJSON gagal dimuat. Periksa lokasi file.");
      return;
    }
  
    const data = response.data;
  
    // Ganti koordinat contoh dengan titik kos dan kampus yang tepat.
    const titikKos = [107.5755, -6.8737];
    const titikKampus = [107.5772, -6.8752];
  
    const jalan = {
      type: "FeatureCollection",
      features: data.features.filter((feature) =>
        ["LineString", "MultiLineString"].includes(
          feature.geometry?.type
        )
      )
    };
  
    // Tampilkan jaringan garis jalan dari GeoJSON.
    addGeoJSON("peta", jalan, {
      style: {
        stroke: "#64748b",
        strokeWidth: 3
      }
    });
  
    const rute = findRoute(titikKos, titikKampus, jalan, {
      precision: 5
    });
  
    if (!rute) {
      setInner(
        "status",
        "Rute tidak ditemukan. Periksa koordinat dan sambungan garis jalan."
      );
      fitMap("peta", jalan);
      return;
    }
  
    addGeoJSON("peta", rute, {
      style: {
        stroke: "#e63946",
        strokeWidth: 6
      },
      popup: () => "Rute kos ke kampus"
    });
  
    fitMap("peta", rute);
  
    setInner(
      "status",
      `Rute ditemukan! Jarak sepanjang jalan: ${Math.round(
        rute.properties.distance
      )} meter.`
    );
  });
  