import React from "react";
import axios from "axios";
import { useState } from "react";
import { Model } from "../types";
import ModelsList from "./ModelsList";

interface ModelFormProps {
  models: Model[];
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  setModelResponse: (response: string) => void;
  setProcessingTime: (time: number | null) => void;
}

const ModelForm = ({
  models,
  selectedModel,
  setSelectedModel,
  setModelResponse,
  setProcessingTime,
}: ModelFormProps) => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setProcessingTime(null);

    const startTime = performance.now();

    try {
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

      const endTime = performance.now();
      setProcessingTime(parseFloat(((endTime - startTime) / 1000).toFixed(1)));
      setModelResponse(JSON.stringify(response.data));
    } catch (error) {
      setModelResponse("Error: Failed to get a response from the model.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Select Model</h2>
        <ModelsList
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          models={models}
          setModelResponse={setModelResponse}
          setProcessingTime={setProcessingTime}
        />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Enter Your Query</h2>
        <textarea
          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none h-32"
          placeholder="Type your query here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isProcessing || !input.trim()}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Submit Query</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ModelForm;
