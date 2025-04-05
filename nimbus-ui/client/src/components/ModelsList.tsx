const ModelsList = ({ models }: { models: any[] }) => {
  return (
    <div>
      <h2>Below are the Models available for prediction</h2>
      <ul>
        {models.map((model) => (
          <li key={model.modelName}>{model.modelName} - {model.endpoint}</li>
        ))}
      </ul>
    </div>
  )
}

export default ModelsList