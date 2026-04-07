import "./App.css";
import MedicalVisor from "./components/medical=visor";
import SlideUploader from "./components/SlideUploader";

function App() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <MedicalVisor dziUrl="https://pythonsvs-production.up.railway.app/slides/CMU-1.dzi" />
          <SlideUploader />
        </div>
      </section>
    </>
  );
}

export default App;
