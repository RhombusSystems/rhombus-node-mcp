import { beforeEach, describe, expect, it, vi } from "vitest";

import { updatePerson } from "../../src/api/faces-tool-api.js";
import * as network from "../../src/network/network.js";

vi.mock("../../src/network/network.js", async importOriginal => {
	const actual = await importOriginal<typeof network>();
	return { ...actual, postApi: vi.fn() };
});

const PERSON_UUID = "43q4M5KZSFm9MOm5uJFtwQ";

/**
 * `updatePerson` sends api2 an `updatedSetMethodMap` naming which fields were
 * deliberately set. The keys are SETTER names (`setName`), not field names
 * (`name`).
 *
 * This is not cosmetic and it is not something the spec documents —
 * `updatedSetMethodMap` is declared as an open `{string: boolean}` map. Sending
 * `{name: true}` produced an api2 response with `error: false`, and bumped the
 * record's `updatedOn`, while leaving the name completely unchanged: a silent
 * no-op that reported success. Found on api2.itg 2026-08-05, after the tool had
 * shipped with `{name: true}` and passing unit tests.
 */
describe("updatePerson updatedSetMethodMap", () => {
	beforeEach(() => {
		vi.mocked(network.postApi).mockReset();
		vi.mocked(network.postApi).mockResolvedValue({ error: false } as never);
	});

	function sentBody() {
		const call = vi.mocked(network.postApi).mock.calls[0][0];
		expect(call.route).toBe("/faceRecognition/person/updatePerson");
		return call.body as {
			personSelectiveUpdate: {
				uuid: string;
				name?: string;
				email?: string;
				updatedSetMethodMap: Record<string, boolean>;
			};
		};
	}

	it("flags a name change with setName, not name", async () => {
		await updatePerson(PERSON_UUID, { name: "Renamed Person" });

		const { personSelectiveUpdate } = sentBody();
		expect(personSelectiveUpdate.name).toBe("Renamed Person");
		expect(personSelectiveUpdate.updatedSetMethodMap).toEqual({ setName: true });
		// The field-name form is what silently no-ops.
		expect(personSelectiveUpdate.updatedSetMethodMap).not.toHaveProperty("name");
	});

	it("flags an email change with setEmail, not email", async () => {
		await updatePerson(PERSON_UUID, { email: "person@example.invalid" });

		const { personSelectiveUpdate } = sentBody();
		expect(personSelectiveUpdate.email).toBe("person@example.invalid");
		expect(personSelectiveUpdate.updatedSetMethodMap).toEqual({ setEmail: true });
		expect(personSelectiveUpdate.updatedSetMethodMap).not.toHaveProperty("email");
	});

	it("flags only the fields the caller passed, so omitted ones are left alone", async () => {
		await updatePerson(PERSON_UUID, { name: "Both Changed", email: "both@example.invalid" });

		expect(sentBody().personSelectiveUpdate.updatedSetMethodMap).toEqual({
			setName: true,
			setEmail: true,
		});
	});

	it("sends an empty map when nothing was passed, rather than clearing fields", async () => {
		await updatePerson(PERSON_UUID, {});

		const { personSelectiveUpdate } = sentBody();
		expect(personSelectiveUpdate.updatedSetMethodMap).toEqual({});
		expect(personSelectiveUpdate.uuid).toBe(PERSON_UUID);
	});
});
