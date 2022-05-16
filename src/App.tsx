import "./styles.css";
import FactForm from "./FactForm";
import { prompt } from "./aiService";
import { set, get } from "./storageService";

export default function App() {
  return (
    <div className="App container">
      <FactForm prompt={prompt} set={set} get={get} />
    </div>
  );
}
