interface ResponseProps {
  response: string;
  processingTime: number | null;
}

const Response = ({ response, processingTime }: ResponseProps) => {
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
      <div className="p-4 min-h-[80px] text-gray-300">
        {response ? (
          <div>{response}</div>
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
