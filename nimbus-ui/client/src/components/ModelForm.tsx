import ModelsList from "./ModelsList";
import { Model } from "../types";

interface ModelFormProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.SyntheticEvent) => void;
  models: Model[];
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
}

const ModelForm = ({
  input,
  setInput,
  handleSubmit,
  models,
  selectedModel,
  setSelectedModel,
}: ModelFormProps) => {
  return (
    <form>
      <ModelsList
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        models={models}
      />
      <textarea
        placeholder="Enter your query here"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
};

export default ModelForm;
