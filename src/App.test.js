import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(
    /Twilio Sync Quickstart with React and Node.js/i
  );
  expect(linkElement).toBeInTheDocument();
});
