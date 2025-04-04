import axios from "axios";
import { useState, useEffect } from "react";
import ModelForm from "./ModelForm";
import { Model } from "../types";
import Response from './Response'
import ModelDetails from './ModelDetails'

const SandBox = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model>({
    modelName: "",
    modelType: "",
    description: "",
    endpoint: "",
  });
  const [modelResponse, setModelResponse] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      const response = await axios.get("http://localhost:3001/api/models");
      setModels(response.data);
      setSelectedModel(response.data[0]);
    };
    fetchModels();
  }, []);

  return (
    <div>
      <ModelForm
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        setModelResponse={setModelResponse}
      />
      <Response response={modelResponse} />
       <ModelDetails selectedModel={selectedModel}/>
    </div>
  );
};

export default SandBox;
