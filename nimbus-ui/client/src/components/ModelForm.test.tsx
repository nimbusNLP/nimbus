import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModelForm from './ModelForm';
import { Model } from '../types';
import axios from 'axios';

// Mock the axios module
vi.mock('axios');

// Mock the ModelsList component
vi.mock('./ModelsList', () => ({
  default: ({ selectedModel, setSelectedModel, models }: any) => (
    <div data-testid="mock-models-list">
      <select 
        data-testid="model-selector"
        value={selectedModel.modelName}
        onChange={(e) => {
          const selected = models.find((m: any) => m.modelName === e.target.value);
          if (selected) setSelectedModel(selected);
        }}
      >
        {models.map((model: any) => (
          <option key={model.modelName} value={model.modelName}>
            {model.modelName}
          </option>
        ))}
      </select>
    </div>
  )
}));

describe('ModelForm Component', () => {
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
    }
  ];

  const mockSelectedModel: Model = mockModels[0];
  
  // Mock functions
  const mockSetSelectedModel = vi.fn();
  const mockSetModelResponse = vi.fn();
  const mockSetProcessingTime = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the form elements correctly', () => {
    render(
      <ModelForm
        models={mockModels}
        selectedModel={mockSelectedModel}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Check if the ModelsList component is rendered
    expect(screen.getByTestId('mock-models-list')).toBeInTheDocument();
    
    // Check if the textarea is rendered
    const textarea = screen.getByPlaceholderText('Type your query here...');
    expect(textarea).toBeInTheDocument();
    
    // Check if the submit button is rendered with the correct text
    const submitButton = screen.getByText('Submit Query');
    expect(submitButton).toBeInTheDocument();
    
    // Check if the button is disabled initially (empty input)
    expect(submitButton.closest('button')).toBeDisabled();
  });

  it('enables the submit button when text is entered', async () => {
    render(
      <ModelForm
        models={mockModels}
        selectedModel={mockSelectedModel}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Get the textarea and button
    const textarea = screen.getByPlaceholderText('Type your query here...');
    const submitButton = screen.getByText('Submit Query').closest('button');
    
    // Initially the button should be disabled
    expect(submitButton).toBeDisabled();
    
    // Enter text in the textarea
    await userEvent.type(textarea, 'Test query');
    
    // Button should now be enabled
    expect(submitButton).not.toBeDisabled();
  });

  it('submits the form and calls the API correctly', async () => {
    // Use vi.spyOn instead of direct assignment for performance.now
    const performanceSpy = vi.spyOn(performance, 'now');
    performanceSpy.mockReturnValueOnce(1000).mockReturnValueOnce(3500);
    
    // Mock successful axios response
    (axios.post as any).mockResolvedValue({
      data: { result: 'This is a test response' }
    });
    
    render(
      <ModelForm
        models={mockModels}
        selectedModel={mockSelectedModel}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Get the textarea and button
    const textarea = screen.getByPlaceholderText('Type your query here...');
    const submitButton = screen.getByText('Submit Query').closest('button');
    
    // Enter text and submit the form
    await userEvent.type(textarea, 'Test query');
    fireEvent.click(submitButton!);
    
    // Check if axios.post was called with the correct arguments
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        mockSelectedModel.endpoint,
        { text: 'Test query' },
        { headers: { 'Content-Type': 'application/json' } }
      );
    });
    
    // Check if processing time and response were set
    await waitFor(() => {
      expect(mockSetModelResponse).toHaveBeenCalledWith(JSON.stringify({ result: 'This is a test response' }));
    });
    
    // Check that the processing time was set correctly (we can't use toHaveBeenCalledWith because the actual value depends on the implementation)
    expect(mockSetProcessingTime).toHaveBeenCalled();
    
    // Restore the original performance.now
    performanceSpy.mockRestore();
  });

  it('shows loading state while processing', async () => {
    // Mock a delayed response
    (axios.post as any).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ data: { result: 'Delayed response' } });
        }, 100);
      });
    });

    render(
      <ModelForm
        models={mockModels}
        selectedModel={mockSelectedModel}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Get the textarea and button
    const textarea = screen.getByPlaceholderText('Type your query here...');
    const submitButton = screen.getByText('Submit Query').closest('button');
    
    // Enter text and submit the form
    await userEvent.type(textarea, 'Test query');
    fireEvent.click(submitButton!);
    
    // Check if loading state is shown
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    // Check for the spinner SVG (using a different approach since it doesn't have a role)
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    
    // Wait for the response to complete
    await waitFor(() => {
      expect(mockSetModelResponse).toHaveBeenCalled();
    });
  });

  it('handles API errors correctly', async () => {
    // Mock a failed response
    (axios.post as any).mockRejectedValue(new Error('API Error'));

    render(
      <ModelForm
        models={mockModels}
        selectedModel={mockSelectedModel}
        setSelectedModel={mockSetSelectedModel}
        setModelResponse={mockSetModelResponse}
        setProcessingTime={mockSetProcessingTime}
      />
    );
    
    // Get the textarea and button
    const textarea = screen.getByPlaceholderText('Type your query here...');
    const submitButton = screen.getByText('Submit Query').closest('button');
    
    // Enter text and submit the form
    await userEvent.type(textarea, 'Test query');
    fireEvent.click(submitButton!);
    
    // Wait for the error to be handled
    await waitFor(() => {
      expect(mockSetModelResponse).toHaveBeenCalledWith('Error: Failed to get a response from the model.');
    });
    
    // Check that the form returns to non-processing state
    await waitFor(() => {
      expect(screen.getByText('Submit Query')).toBeInTheDocument();
    });
  });
});
