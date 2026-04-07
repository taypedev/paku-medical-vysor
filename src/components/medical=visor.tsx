import OpenSeadragon from "openseadragon";
import { useEffect } from "react";

interface MedicalVisorProps {
  dziUrl: string;
}

const MedicalVisor = ({ dziUrl }: MedicalVisorProps) => {
  useEffect(() => {
    const viewer = OpenSeadragon({
      id: "openseadragon-viewer",
      prefixUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/",
      tileSources: dziUrl,
      showNavigator: true, // Mini mapa en la esquina
      navigatorPosition: "BOTTOM_RIGHT",
      animationTime: 0.5,
      // blendingTime: 0.1,
      constrainDuringPan: true,
      maxZoomPixelRatio: 2,
      visibilityRatio: 1.0,
    });

    return () => {
      viewer.destroy();
    };
  }, [dziUrl]);

  return (
    <div
      id="openseadragon-viewer"
      style={{
        width: "100%",
        height: "500px",
        backgroundColor: "#000",
        border: "2px solid #333",
      }}
    />
  );
};

export default MedicalVisor;
