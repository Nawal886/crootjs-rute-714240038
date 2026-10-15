
import {
    createMap,
    addGeoJSON,
    fitMap,
    getGeoJSON
  } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.js";
  
  import {
    setInner
  } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/element.js";
  
  createMap("peta", {
    center: [107.5761, -6.8745],
    zoom: 17
  });
  
  getGeoJSON("./data/OTW%20kampus.geojson", (response) => {
    if (!response.data) {
      setInner("status", "GeoJSON gagal dimuat.");
      return;
    }
  
    const data = response.data;
  
    // Ambil hanya Polyline perjalanan kos ke kampus.
    const rute = {
      type: "FeatureCollection",
      features: data.features.filter((feature) =>
        feature.geometry?.type === "LineString" &&
        (
          feature.properties?.nama === "perjalanan" ||
          feature.properties?.keterangan === "dari kos ke kampus"
        )
      )
    };
  
    if (rute.features.length === 0) {
      setInner("status", "Polyline perjalanan tidak ditemukan.");
      return;
    }
  
    addGeoJSON("peta", rute, {
      style: {
        stroke: "#e63946",
        strokeWidth: 6,
        strokeOpacity: 1
      },
      popup: () => "Rute dari kos ke kampus"
    });
  
    fitMap("peta", rute);
  
    setInner("status", "Polyline rute kos ke kampus berhasil ditampilkan!");
  });
  