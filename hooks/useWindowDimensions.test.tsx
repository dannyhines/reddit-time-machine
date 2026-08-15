import React from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { waitFor } from "@testing-library/react";
import useWindowDimensions from "./useWindowDimensions";

const ViewportProbe = () => {
  const { isMobile } = useWindowDimensions();
  return <div data-testid='viewport' data-mobile={isMobile} />;
};

describe("useWindowDimensions", () => {
  it("hydrates mobile browsers from the same initial markup as the server", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 375 });
    const serverMarkup = renderToString(<ViewportProbe />);
    expect(serverMarkup).toContain('data-mobile="false"');

    const container = document.createElement("div");
    container.innerHTML = serverMarkup;
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const root = hydrateRoot(container, <ViewportProbe />);

    await waitFor(() => expect(container.firstElementChild).toHaveAttribute("data-mobile", "true"));
    expect(consoleError.mock.calls.flat().join(" ")).not.toMatch(/hydration|did not match/i);

    root.unmount();
    consoleError.mockRestore();
  });
});
