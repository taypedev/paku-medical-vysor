import OpenSeadragon from "openseadragon";
import { useEffect } from "react";

const MedicalVisor = () => {
  // Referencia al contenedor del visor
  // const viewerRef = useRef(null);

  useEffect(() => {
    // Inicializamos el visor cuando el componente se monta
    const viewer = OpenSeadragon({
      id: "openseadragon-viewer", // ID del elemento HTML
      prefixUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/", // Iconos del visor
      tileSources: "http://localhost:8080/CMU-1.dzi",
      showNavigator: true, // Mini mapa en la esquina
      navigatorPosition: "BOTTOM_RIGHT",
      animationTime: 0.5,
      // blendingTime: 0.1,
      constrainDuringPan: true,
      maxZoomPixelRatio: 2,
      visibilityRatio: 1.0,
    });

    return () => {
      // Limpiamos el visor al desmontar para evitar fugas de memoria
      viewer.destroy();
    };
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>VisuMed Demo - Visor de Alta Resolución</h2>
      <div
        id="openseadragon-viewer"
        style={{
          width: "100%",
          height: "500px",
          backgroundColor: "#000",
          border: "2px solid #333",
        }}
      />
      <p>Prueba el zoom con la rueda del ratón o los controles.</p>
    </div>
  );
};

export default MedicalVisor;
