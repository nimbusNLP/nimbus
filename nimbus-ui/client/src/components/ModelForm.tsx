import axios from "axios";
import { useState } from "react";
import { Model } from "../types";
import ModelsList from "./ModelsList";


interface ModelFormProps {
  models: Model[];
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  setModelResponse: (response: string) => void;
}

const ModelForm = ({
  models,
  selectedModel,
  setSelectedModel,
  setModelResponse,
}: ModelFormProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const response = await axios.post(
      selectedModel.endpoint,
      {
        text: input,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setModelResponse(JSON.stringify(response.data));
  };


  return (
    <form>
      <ModelsList
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        models={models}
        setModelResponse={setModelResponse}
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
