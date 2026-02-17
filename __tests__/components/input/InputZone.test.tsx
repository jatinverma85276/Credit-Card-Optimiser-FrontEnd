import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InputZone } from '@/components/input/InputZone';
import { ChatProvider } from '@/contexts/ChatContext';

// Mock fetch for API calls
global.fetch = vi.fn();

describe('InputZone', () => {
  it('should render input zone with all buttons', () => {
    render(
      <ChatProvider>
        <InputZone />
      </ChatProvider>
    );

    // Check for textarea
    const textarea = screen.getByPlaceholderText('Ask about credit cards...');
    expect(textarea).toBeInTheDocument();

    // Check for attachment button
    const attachButton = screen.getByLabelText('Attach file');
    expect(attachButton).toBeInTheDocument();

    // Check for voice button
    const voiceButton = screen.getByLabelText('Voice input');
    expect(voiceButton).toBeInTheDocument();

    // Check for send button
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeInTheDocument();
  });

  it('should disable send button when input is empty', () => {
    render(
      <ChatProvider>
        <InputZone />
      </ChatProvider>
    );

    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeDisabled();
  });
});
