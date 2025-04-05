import { Model } from "../types";

interface ModelsListProps {
  models: Model[];
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  setModelResponse: (response: string) => void;
  setProcessingTime: (time: number | null) => void;
}

const ModelsList = ({
  models,
  selectedModel,
  setSelectedModel,
  setModelResponse,
  setProcessingTime,
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
    setModelResponse("");
    setProcessingTime(null);
  };

  return (
    <div className="relative">
      <select
        value={selectedModel.modelName}
        onChange={handleModelChange}
        className="block w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      >
        <option disabled value="">
          Choose a model...
        </option>
        {models.map((model) => (
          <option key={model.modelName} value={model.modelName}>
            {model.modelName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default ModelsList;
