import axios from "axios";
import { useState, useEffect } from "react";
import ModelForm from "./ModelForm";
import { Model } from "../types";
import Response from "./Response";
import ModelDetails from "./ModelDetails";

const SandBox = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model>({
    modelName: "",
    modelType: "",
    description: "",
    endpoint: "",
  });
  const [modelResponse, setModelResponse] = useState("");
  const [processingTime, setProcessingTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      const response = await axios.get("http://localhost:3001/api/models");
      setModels(response.data);
    };
    fetchModels();
  }, []);

  console.log(processingTime);

  return (
    <div className="space-y-6">
      <ModelForm
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        setModelResponse={setModelResponse}
        setProcessingTime={setProcessingTime}
      />
      <Response response={modelResponse} processingTime={processingTime} />
      <ModelDetails selectedModel={selectedModel} />
    </div>
  );
};

export default SandBox;
