import axios from "axios";
import { createSignal, ParentProps, Show } from "solid-js";
import { useClientSession } from "~/hooks/sessionHooks";
import { PopIn } from "./ui/animations";
import { Form } from "./ui/form";

// Not secure. Sensible data must be requested from backend. Not cached
export default function SensibleData(props: ParentProps) {
  const { userData, sensibleEnabled, setSensibleEnabled } = useClientSession();
  const [request, setRequest] = createSignal(false);
  async function handleSubmit(vals: Record<string, unknown>) {
    try {
      await axios.get(`/api/users/${userData.email}/jwt`, {
        headers: {
          password: vals.password as string,
        },
      });
    } catch (e) {
      return setSensibleEnabled(false);
    }
    setSensibleEnabled(true);
  }
  return (
    <>
      <Show when={request() && !sensibleEnabled()}>
        <PopIn class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-white z-20 w-64">
          <button
            class="absolute top-2 right-2"
            onClick={() => setRequest(false)}
          >
            <p>✖</p>
          </button>
          <Form
            class="flex flex-col gap-1"
            asyncSuccessCallback={handleSubmit}
            inputs={[
              {
                type: "password",
                title: "Verify Yourself. Enter your password:",
                placeholder: "********",
                name: "password",
                required: true,
              },
            ]}
          />
        </PopIn>
      </Show>
      <Show
        when={sensibleEnabled()}
        fallback={
          <button onClick={() => setRequest(true)}>
            <p>Click to View</p>
          </button>
        }
      >
        {props.children}
      </Show>
    </>
  );
}
