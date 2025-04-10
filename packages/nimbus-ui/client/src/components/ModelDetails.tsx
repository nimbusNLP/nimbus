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
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-sm text-indigo-400 w-24 flex-shrink-0">
              Name:
            </span>
            <span className="font-mono text-sm">
              {selectedModel.modelName || "Not selected"}
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-indigo-400 w-24 flex-shrink-0">
              Endpoint:
            </span>
            <div className="overflow-x-auto whitespace-nowrap">
              <span className="font-mono text-sm">
                {selectedModel.endpoint || "Not available"}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-indigo-400 w-24 flex-shrink-0">
              Description:
            </span>
            <div className="overflow-x-auto whitespace-nowrap">
              <span className="font-mono text-sm">
                {selectedModel.description || "No description available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetails;
