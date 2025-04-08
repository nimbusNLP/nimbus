import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Response from './Response';

describe('Response Component', () => {
  it('renders empty state correctly', () => {
    render(<Response response="" processingTime={null} />);
    
    // Check if the title is rendered
    expect(screen.getByText('Response')).toBeInTheDocument();
    
    // Check if the placeholder text is displayed
    expect(screen.getByText('The model response will appear here...')).toBeInTheDocument();
    
    // Check that processing time is not displayed
    expect(screen.queryByText(/Processing time:/)).not.toBeInTheDocument();
  });

  it('renders plain text response correctly', () => {
    const testResponse = 'This is a plain text response from the model';
    render(<Response response={testResponse} processingTime={1.5} />);
    
    // Check if the response text is displayed
    expect(screen.getByText(testResponse)).toBeInTheDocument();
    
    // Check if processing time is displayed
    expect(screen.getByText('Processing time: 1.5s')).toBeInTheDocument();
  });

  it('renders and formats JSON response correctly', () => {
    const jsonResponse = JSON.stringify({
      result: 'Success',
      data: {
        prediction: 'This is a prediction',
        confidence: 0.95
      }
    });
    
    render(<Response response={jsonResponse} processingTime={2.3} />);
    
    // Check if the JSON is parsed and displayed
    expect(screen.getByText(/"result": "Success"/)).toBeInTheDocument();
    expect(screen.getByText(/"prediction": "This is a prediction"/)).toBeInTheDocument();
    expect(screen.getByText(/"confidence": 0.95/)).toBeInTheDocument();
    
    // Check if the pre element is used for formatted JSON
    const preElement = screen.getByText(/"result": "Success"/).closest('pre');
    expect(preElement).toBeInTheDocument();
    expect(preElement).toHaveClass('whitespace-pre-wrap');
    expect(preElement).toHaveClass('font-mono');
  });

  it('handles invalid JSON gracefully', () => {
    const invalidJson = '{ "key": "value", this is not valid JSON }';
    render(<Response response={invalidJson} processingTime={0.8} />);
    
    // Check if the invalid JSON is displayed as plain text
    expect(screen.getByText(invalidJson)).toBeInTheDocument();
    
    // Check that it's not in a pre element
    const divElement = screen.getByText(invalidJson).closest('div');
    expect(divElement).toHaveClass('whitespace-pre-wrap');
  });

  it('has the correct styling classes', () => {
    render(<Response response="Test response" processingTime={1.2} />);
    
    // Check if the container has the correct classes
    const container = screen.getByText('Response').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-gray-800');
    expect(container).toHaveClass('rounded-md');
    expect(container).toHaveClass('border');
    expect(container).toHaveClass('border-gray-700');
    
    // Check if the header has the correct classes
    const header = screen.getByText('Response').closest('div');
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('justify-between');
    expect(header).toHaveClass('bg-gray-850');
    
    // Check if the content area has the correct classes
    const content = container?.querySelector('.p-4');
    expect(content).toHaveClass('min-h-[80px]');
    expect(content).toHaveClass('text-gray-300');
    expect(content).toHaveClass('max-h-[300px]');
  });
});
