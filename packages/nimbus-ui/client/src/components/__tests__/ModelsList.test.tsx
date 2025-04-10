import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ModelsList from '../ModelsList';
import { Model } from '../../types';

describe('ModelsList Component', () => {
  const mockModels: Model[] = [
    { 
      modelName: 'sentiment-model', 
      modelType: 'sentiment', 
      description: 'A sentiment analysis model', 
      endpoint: 'https://api.example.com/sentiment-model/predict' 
    },
    { 
      modelName: 'classification-model', 
      modelType: 'classification', 
      description: 'A classification model', 
      endpoint: 'https://api.example.com/classification-model/predict' 
    }
  ];

  const mockSetSelectedModel = vi.fn();
  const mockSetModelResponse = vi.fn();
  const mockSetProcessingTime = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dropdown with model options', () => {
    render(
      <ModelsList 
        models={mockModels}
        selectedModel={mockModels[0]}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Check if the select element is rendered with the correct value
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('sentiment-model');
    
    // Check if all model options are rendered
    expect(screen.getByText('sentiment-model')).toBeInTheDocument();
    expect(screen.getByText('classification-model')).toBeInTheDocument();
  });

  it('calls the appropriate functions when a new model is selected', () => {
    render(
      <ModelsList 
        models={mockModels}
        selectedModel={mockModels[0]}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Get the select element
    const selectElement = screen.getByRole('combobox');
    
    // Change the selected option
    fireEvent.change(selectElement, { target: { value: 'classification-model' } });
    
    // Verify that the appropriate functions were called
    expect(mockSetSelectedModel).toHaveBeenCalledWith(mockModels[1]);
    expect(mockSetModelResponse).toHaveBeenCalledWith('');
    expect(mockSetProcessingTime).toHaveBeenCalledWith(null);
  });

  it('renders a disabled placeholder option when no model is selected', () => {
    const emptyModel: Model = { 
      modelName: '', 
      modelType: '', 
      description: '', 
      endpoint: '' 
    };
    
    render(
      <ModelsList 
        models={mockModels}
        selectedModel={emptyModel}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Check if the placeholder option is rendered
    expect(screen.getByText('Choose a model...')).toBeInTheDocument();
  });
});
