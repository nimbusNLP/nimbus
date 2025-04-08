import { describe, it, expect, vi } from 'vitest';
import generateLambdaFile from '../src/lambdaCode';
import path from 'path/posix';

// Mock path/posix
vi.mock('path/posix', () => ({
  default: {
    basename: vi.fn((p) => p.split('/').pop()),
  },
}));

describe('generateLambdaFile', () => {
  it('should generate lambda code for pre-trained model', () => {
    const modelType = 'pre-trained';
    const modelNameOrPath = 'en_core_web_sm';
    
    const result = generateLambdaFile(modelType, modelNameOrPath);
    
    // Verify the generated code contains the correct model path
    expect(result).toContain('nlp = spacy.load("en_core_web_sm")');
    
    // Verify other important parts of the lambda code
    expect(result).toContain('import json');
    expect(result).toContain('import spacy');
    expect(result).toContain('def lambda_handler(event, context):');
    expect(result).toContain('return {');
    expect(result).toContain('"statusCode": 200');
    expect(result).toContain('"headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}');
  });

  it('should generate lambda code for fine-tuned model', () => {
    const modelType = 'fine-tuned';
    const modelNameOrPath = '/path/to/model/best-model';
    
    // Mock basename to return 'best-model'
    vi.mocked(path.basename).mockReturnValue('best-model');
    
    const result = generateLambdaFile(modelType, modelNameOrPath);
    
    // Verify the generated code contains the correct model path
    expect(result).toContain('nlp = spacy.load("/var/task/best-model")');
    
    // Verify path.basename was called with the model path
    expect(path.basename).toHaveBeenCalledWith('/path/to/model/best-model');
    
    // Verify other important parts of the lambda code
    expect(result).toContain('import json');
    expect(result).toContain('import spacy');
    expect(result).toContain('def lambda_handler(event, context):');
  });

  it('should handle error cases in the generated code', () => {
    const modelType = 'pre-trained';
    const modelNameOrPath = 'en_core_web_sm';
    
    const result = generateLambdaFile(modelType, modelNameOrPath);
    
    // Verify error handling in the generated code
    expect(result).toContain('except Exception as e:');
    expect(result).toContain('logger.error(f"Error loading model: {e}")');
    expect(result).toContain('logger.error(f"Invalid JSON input: {e}")');
    expect(result).toContain('"statusCode": 400');
    expect(result).toContain('"body": json.dumps({"error": "Invalid JSON input", "message": str(e)})');
  });

  it('should handle empty text input in the generated code', () => {
    const modelType = 'pre-trained';
    const modelNameOrPath = 'en_core_web_sm';
    
    const result = generateLambdaFile(modelType, modelNameOrPath);
    
    // Verify empty text handling in the generated code
    expect(result).toContain('if not text:');
    expect(result).toContain('logger.warning("No text provided")');
    expect(result).toContain('"body": json.dumps({"error": "No text provided"})');
  });
});
