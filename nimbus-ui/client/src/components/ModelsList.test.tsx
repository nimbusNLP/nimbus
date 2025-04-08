import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModelsList from './ModelsList';
import { Model } from '../types';

// Mock SVG for testing
vi.mock('*.svg', () => ({
  default: () => <div data-testid="mock-svg" />
}));

describe('ModelsList Component', () => {
  // Test data
  const mockModels: Model[] = [
    {
      modelName: 'model1',
      modelType: 'llm',
      description: 'Test model 1',
      endpoint: 'https://api.example.com/model1'
    },
    {
      modelName: 'model2',
      modelType: 'llm',
      description: 'Test model 2',
      endpoint: 'https://api.example.com/model2'
    },
    {
      modelName: 'model3',
      modelType: 'embedding',
      description: 'Test model 3',
      endpoint: 'https://api.example.com/model3'
    }
  ];

  const mockSelectedModel: Model = mockModels[0];
  
  // Mock functions
  const mockSetSelectedModel = vi.fn();
  const mockSetModelResponse = vi.fn();
  const mockSetProcessingTime = vi.fn();

  it('renders the select dropdown with all models', () => {
    render(
      <ModelsList
        models={mockModels}
        selectedModel={mockSelectedModel}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Check if the select element is rendered
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    
    // Check if all model options are rendered
    expect(screen.getByText('model1')).toBeInTheDocument();
    expect(screen.getByText('model2')).toBeInTheDocument();
    expect(screen.getByText('model3')).toBeInTheDocument();
    
    // Check if the correct model is selected
    expect(selectElement).toHaveValue('model1');
  });

  it('calls setSelectedModel when a different model is selected', () => {
    render(
      <ModelsList
        models={mockModels}
        selectedModel={mockSelectedModel}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Get the select element
    const selectElement = screen.getByRole('combobox');
    
    // Change the selected model
    fireEvent.change(selectElement, { target: { value: 'model2' } });
    
    // Check if setSelectedModel was called with the correct model
    expect(mockSetSelectedModel).toHaveBeenCalledWith(mockModels[1]);
    
    // Check if setModelResponse and setProcessingTime were called to reset the state
    expect(mockSetModelResponse).toHaveBeenCalledWith('');
    expect(mockSetProcessingTime).toHaveBeenCalledWith(null);
  });

  it('handles the case when no models are available', () => {
    render(
      <ModelsList
        models={[]}
        selectedModel={{ modelName: '', modelType: '', description: '', endpoint: '' }}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Check if the select element is rendered
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    
    // Check if the placeholder option is rendered
    expect(screen.getByText('Choose a model...')).toBeInTheDocument();
    
    // Check that no model options are rendered
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(1); // Only the placeholder option
  });

  it('handles selecting a model that does not exist', () => {
    render(
      <ModelsList
        models={mockModels}
        selectedModel={mockSelectedModel}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Get the select element
    const selectElement = screen.getByRole('combobox');
    
    // Simulate a change event with a non-existent model
    fireEvent.change(selectElement, { target: { value: 'non-existent-model' } });
    
    // Check if setSelectedModel was called with an empty model object
    expect(mockSetSelectedModel).toHaveBeenCalledWith({
      modelName: '',
      modelType: '',
      description: '',
      endpoint: ''
    });
  });

  it('has the correct styling classes', () => {
    render(
      <ModelsList
        models={mockModels}
        selectedModel={mockSelectedModel}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Check if the select element has the correct classes
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass('block');
    expect(selectElement).toHaveClass('w-full');
    expect(selectElement).toHaveClass('bg-gray-800');
    expect(selectElement).toHaveClass('border');
    expect(selectElement).toHaveClass('border-gray-700');
    expect(selectElement).toHaveClass('rounded-md');
    expect(selectElement).toHaveClass('text-white');
    
    // Check if the dropdown arrow container has the correct classes
    const arrowContainer = selectElement.parentElement?.querySelector('.pointer-events-none');
    expect(arrowContainer).toHaveClass('absolute');
    expect(arrowContainer).toHaveClass('inset-y-0');
    expect(arrowContainer).toHaveClass('right-0');
    expect(arrowContainer).toHaveClass('flex');
    expect(arrowContainer).toHaveClass('items-center');
  });
});
