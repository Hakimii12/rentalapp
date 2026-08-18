import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FiltersBar from "@/app/(nondashboard)/search/FiltersBar";
import { renderWithStore } from "./test-utils";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/search",
}));

describe("FiltersBar", () => {
  beforeEach(() => {
    pushMock.mockReset();
    vi.restoreAllMocks();
  });

  it("toggles the full filters panel and switches to list view", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<FiltersBar />);

    await user.click(screen.getByRole("button", { name: /all filters/i }));
    await user.click(screen.getByRole("button", { name: /list view/i }));

    expect(store.getState().global.isFiltersFullOpen).toBe(true);
    expect(store.getState().global.viewMode).toBe("list");
  });

  it("searches for a location and stores the returned coordinates", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({
        features: [{ center: [12.34, 56.78] }],
      }),
    } as Response);

    const { store } = renderWithStore(<FiltersBar />);

    await user.clear(screen.getByPlaceholderText(/search location/i));
    await user.type(screen.getByPlaceholderText(/search location/i), "Austin");
    await user.click(screen.getByRole("button", { name: /search location/i }));

    await waitFor(() =>
      expect(store.getState().global.filters).toMatchObject({
        location: "Austin",
        coordinates: [12.34, 56.78],
      })
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
