import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ModelDetails from './ModelDetails';
import { Model } from '../types';

describe('ModelDetails Component', () => {
  it('renders the component with model data', () => {
    const mockModel: Model = {
      modelName: 'test-model',
      modelType: 'llm',
      description: 'Test model description',
      endpoint: 'https://api.example.com/test-model/predict'
    };

    render(<ModelDetails selectedModel={mockModel} />);
    
    // Check if the title is rendered
    expect(screen.getByText('Selected Model Information')).toBeInTheDocument();
    
    // Check if model name is displayed correctly
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('test-model')).toBeInTheDocument();
    
    // Check if endpoint is displayed correctly
    expect(screen.getByText('Endpoint:')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com/test-model/predict')).toBeInTheDocument();
    
    // Check if description is displayed correctly
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Test model description')).toBeInTheDocument();
  });

  it('renders fallback text when model data is missing', () => {
    const emptyModel: Model = {
      modelName: '',
      modelType: '',
      description: '',
      endpoint: ''
    };

    render(<ModelDetails selectedModel={emptyModel} />);
    
    // Check if fallback texts are displayed
    expect(screen.getByText('Not selected')).toBeInTheDocument();
    expect(screen.getByText('Not available')).toBeInTheDocument();
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('has the correct styling classes', () => {
    const mockModel: Model = {
      modelName: 'test-model',
      modelType: 'llm',
      description: 'Test model description',
      endpoint: 'https://api.example.com/test-model/predict'
    };

    render(<ModelDetails selectedModel={mockModel} />);
    
    // Check if the container has the correct classes
    const container = screen.getByText('Selected Model Information').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-gray-800');
    expect(container).toHaveClass('rounded-md');
    expect(container).toHaveClass('border');
    expect(container).toHaveClass('border-gray-700');
    
    // Check if the header has the correct classes
    const header = screen.getByText('Selected Model Information').closest('div');
    expect(header).toHaveClass('px-4');
    expect(header).toHaveClass('py-2');
    expect(header).toHaveClass('bg-gray-850');
    
    // Check if the content area has the correct classes
    const content = container?.querySelector('.p-4');
    expect(content).toHaveClass('text-gray-300');
    
    // Check if the label texts have the correct styling
    const labels = document.querySelectorAll('.text-indigo-400');
    expect(labels.length).toBe(3); // Name, Endpoint, Description
    expect(labels[0]).toHaveClass('w-24');
    expect(labels[0]).toHaveClass('flex-shrink-0');
  });
});
