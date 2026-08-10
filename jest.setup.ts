import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

class JestMessageChannel {
  port1 = { onmessage: null as null | ((event: { data: unknown }) => void) };
  port2 = {
    postMessage: (data: unknown) => setTimeout(() => this.port1.onmessage?.({ data }), 0),
  };
}

Object.assign(global, { MessageChannel: JestMessageChannel, TextDecoder, TextEncoder });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
