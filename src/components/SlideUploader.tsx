import { useEffect, useRef, useState } from "react";
import MedicalVisor from "./medical=visor";

const API = "https://pythonsvs-production.up.railway.app";

type UploadStatus = "idle" | "uploading" | "processing" | "done" | "error";

const SlideUploader = () => {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [dziUrl, setDziUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  const clearPolling = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const waitForConversion = (nombreBase: string, statusUrl: string) => {
    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}${statusUrl}`);
        const data: { status: string } = await res.json();

        if (data.status === "done") {
          clearPolling();
          setStatus("done");
          setStatusMsg("¡Listo! Cargando visor...");
          setDziUrl(`${API}/slides/${nombreBase}.dzi`);
        } else if (data.status.startsWith("error")) {
          clearPolling();
          setStatus("error");
          setStatusMsg(`Error en conversión: ${data.status}`);
        } else {
          setStatusMsg("Procesando... (puede tardar varios minutos)");
        }
      } catch {
        clearPolling();
        setStatus("error");
        setStatusMsg("Error al consultar el estado de la conversión");
      }
    }, 4000);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setStatusMsg("Selecciona un archivo primero");
      return;
    }

    clearPolling();
    setStatus("uploading");
    setStatusMsg("Subiendo archivo...");
    setDziUrl(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${API}/upload`, { method: "POST", body: form });
      if (!res.ok) {
        setStatus("error");
        setStatusMsg("Error al subir el archivo");
        return;
      }

      const data: { nombre_base: string; status_url: string } =
        await res.json();
      setStatus("processing");
      setStatusMsg("Procesando conversión...");
      waitForConversion(data.nombre_base, data.status_url);
    } catch {
      setStatus("error");
      setStatusMsg("Error de red al subir el archivo");
    }
  };

  const statusColor: Record<UploadStatus, string> = {
    idle: "#aaa",
    uploading: "#60a5fa",
    processing: "#facc15",
    done: "#4ade80",
    error: "#f87171",
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>VisuMed — Visor de Láminas</h2>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".svs,.tif,.tiff,.ndpi"
          disabled={status === "uploading" || status === "processing"}
        />
        <button
          onClick={handleUpload}
          disabled={status === "uploading" || status === "processing"}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          {status === "uploading"
            ? "Subiendo..."
            : status === "processing"
              ? "Procesando..."
              : "Subir y procesar"}
        </button>
      </div>

      {statusMsg && (
        <p style={{ color: statusColor[status], marginBottom: "12px" }}>
          {statusMsg}
        </p>
      )}

      {dziUrl && <MedicalVisor dziUrl={dziUrl} />}

      {!dziUrl && (
        <div
          style={{
            width: "100%",
            height: "500px",
            backgroundColor: "#111",
            border: "2px dashed #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
            fontSize: "14px",
          }}
        >
          Sube un archivo para visualizarlo
        </div>
      )}
    </div>
  );
};

export default SlideUploader;
