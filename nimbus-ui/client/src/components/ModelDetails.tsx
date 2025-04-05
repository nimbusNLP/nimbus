import { Model } from "../types";

interface ModelDetailsProps {
  selectedModel: Model;
}

const ModelDetails = ({ selectedModel }: ModelDetailsProps) => {
  return (
    <div className="bg-gray-800 rounded-md border border-gray-700 overflow-hidden">
      <div className="px-4 py-2 bg-gray-850 border-b border-gray-700">
        <h2 className="text-lg font-medium">Selected Model Information</h2>
      </div>
      <div className="p-4 text-gray-300">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-indigo-400 mb-1">Name:</p>
            <p className="font-medium">{selectedModel.modelName}</p>
          </div>
          <div>
            <p className="text-sm text-indigo-400 mb-1">Endpoint:</p>
            <p className="font-mono text-sm">{selectedModel.endpoint}</p>
          </div>
          <div>
            <p className="text-sm text-indigo-400 mb-1">Description:</p>
            <p className="text-sm">{selectedModel.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetails;
