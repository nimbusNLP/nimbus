
interface ResponseProps { 
  response: string;
}

const Response = ({ response }: ResponseProps) => {
  return <div>{response}</div>;
};

export default Response;
