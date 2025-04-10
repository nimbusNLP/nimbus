import React from "react";
interface ResponseProps {
  response: string;
  processingTime: number | null;
}

const Response = ({ response, processingTime }: ResponseProps) => {
  // Function to try parsing and formatting JSON response
  const formatResponse = (responseStr: string) => {
    try {
      // Try to parse the response as JSON
      const parsed = JSON.parse(responseStr);
      // Format it with proper indentation
      return (
        <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch (error) {
      // If it's not valid JSON, return as is
      return <div className="whitespace-pre-wrap">{responseStr}</div>;
    }
  };

  return (
    <div className="bg-gray-800 rounded-md border border-gray-700 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-850 border-b border-gray-700">
        <h2 className="text-lg font-medium">Response</h2>
        {processingTime !== null && (
          <div className="text-sm text-gray-400">
            Processing time: {processingTime}s
          </div>
        )}
      </div>
      <div className="p-4 min-h-[80px] text-gray-300 overflow-auto max-h-[300px]">
        {response ? (
          formatResponse(response)
        ) : (
          <div className="text-gray-500 italic">
            The model response will appear here...
          </div>
        )}
      </div>
    </div>
  );
};

export default Response;
