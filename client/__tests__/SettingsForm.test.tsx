import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsForm from "@/components/SettingsForm";

const initialData = {
  name: "Taylor Tenant",
  email: "taylor@example.com",
  phoneNumber: "1234567890",
};

describe("SettingsForm", () => {
  it("lets a user edit and save their profile details", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <SettingsForm
        initialData={initialData}
        onSubmit={onSubmit}
        userType="tenant"
      />
    );

    await user.click(screen.getByRole("button", { name: /edit/i }));

    const nameInput = screen.getByLabelText(/name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    expect(nameInput).toBeEnabled();
    expect(phoneInput).toBeEnabled();

    await user.clear(nameInput);
    await user.type(nameInput, "Taylor Updated");
    await user.clear(phoneInput);
    await user.type(phoneInput, "0987654321");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Taylor Updated",
        email: "taylor@example.com",
        phoneNumber: "0987654321",
      })
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument()
    );
    expect(screen.queryByRole("button", { name: /save changes/i })).not.toBeInTheDocument();
  });

  it("restores the original values when editing is cancelled", async () => {
    const user = userEvent.setup();

    render(
      <SettingsForm
        initialData={initialData}
        onSubmit={vi.fn()}
        userType="tenant"
      />
    );

    await user.click(screen.getByRole("button", { name: /edit/i }));

    const nameInput = screen.getByLabelText(/name/i);

    await user.clear(nameInput);
    await user.type(nameInput, "Temporary Change");
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByLabelText(/name/i)).toHaveValue("Taylor Tenant");
    expect(screen.getByLabelText(/name/i)).toBeDisabled();
  });
});
