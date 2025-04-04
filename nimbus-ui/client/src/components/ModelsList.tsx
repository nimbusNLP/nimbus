import { Model } from "../types";

interface ModelsListProps {
  models: Model[];
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
}

const ModelsList = ({
  models,
  selectedModel,
  setSelectedModel,
}: ModelsListProps) => {
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(
      models.find((model) => model.modelName === e.target.value) || {
        modelName: "",
        modelType: "",
        description: "",
        endpoint: "",
      }
    );
  };
  return (
    <div>
      <h2>Below are the Models available for prediction</h2>
      <select value={selectedModel.modelName} onChange={handleModelChange}>
        {models.map((model) => (
          <option key={model.modelName}>{model.modelName}</option>
        ))}
      </select>
    </div>
  );
};

export default ModelsList;
