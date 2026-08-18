import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/Navbar";

const pushMock = vi.fn();
const signOutMock = vi.fn();
const useGetAuthUserQueryMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/",
}));

vi.mock("aws-amplify/auth", () => ({
  signOut: () => signOutMock(),
}));

vi.mock("@/state/api", () => ({
  useGetAuthUserQuery: () => useGetAuthUserQueryMock(),
}));

describe("Navbar", () => {
  beforeEach(() => {
    pushMock.mockReset();
    signOutMock.mockReset();
    useGetAuthUserQueryMock.mockReturnValue({
      data: {
        userRole: "manager",
        userInfo: {
          name: "Jordan Manager",
          image: "",
        },
      },
    });
  });

  it("routes managers to the new property flow", async () => {
    const user = userEvent.setup();

    render(<Navbar />);

    await user.click(
      screen.getByRole("button", { name: /add new property/i })
    );

    expect(pushMock).toHaveBeenCalledWith("/managers/newproperty");
  });

  it("opens the profile menu and signs the user out", async () => {
    const user = userEvent.setup();

    signOutMock.mockResolvedValue(undefined);

    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: /jordan manager/i }));
    await user.click(await screen.findByText(/sign out/i));

    await waitFor(() => expect(signOutMock).toHaveBeenCalledTimes(1));
  });
});
