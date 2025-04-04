import axios from "axios";
import { useState, useEffect } from "react";
import ModelForm from "./ModelForm";
import { Model } from "../types";
// import Response from './Response'
// import ModelDetails from './ModelDetails'
const SandBox = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model>({
    modelName: "",
    modelType: "",
    description: "",
    endpoint: "",
  });
  const [input, setInput] = useState("");
  const [modelResponse, setModelResponse] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      const response = await axios.get("http://localhost:3001/api/models");
      setModels(response.data);
    };
    fetchModels();
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const response = await axios.post(
      `https://cfx3hbdfec.execute-api.us-east-2.amazonaws.com/prod/mediummodel/predict`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
        }),
      }
    );
    setModelResponse(response.data);
  };
  return (
    <div>
      <ModelForm
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      {/* <Response />
       <ModelDetails /> */}

      <div>{modelResponse}</div>
    </div>
  );
};

export default SandBox;
