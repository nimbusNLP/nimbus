import { Model } from "../types";

interface ModelDetailsProps {
  selectedModel: Model;
}

const ModelDetails = ({ selectedModel }: ModelDetailsProps) => {
  return <div>
    <h2> Name: {selectedModel.modelName}</h2>
    <p> Description: {selectedModel.description}</p>
    <p> Model Type: {selectedModel.modelType}</p>
    <p> Endpoint: {selectedModel.endpoint}</p>
  </div>;
};

export default ModelDetails;
