import { isBlob } from "@/utils/stdfunc";

import { FieldConfig } from "../types";
import { toFieldValue } from "./helpers";

/**
 * Appends an editable field value to the form payload expected by update actions.
 */
function setFormDataField<R extends Record<string, unknown>, RI extends Record<string, unknown>>(
    fd: FormData,
    field: FieldConfig<R, RI>,
    sourceValues: Partial<RI>,
) {
    const key = String(field.key);
    const formName = field.name ?? key;

    // Form controls may use a custom React Hook Form name, but the server
    // payload must use the matching database property key.
    fd.delete(formName);
    if (formName !== key) fd.delete(key);

    if (field.readOnly && !field.interconnected) return;
    const value = toFieldValue(
        field as FieldConfig<Record<string, unknown>, Record<string, unknown>>,
        (sourceValues as Record<string, unknown>)[key],
    );

    if (field.toFormValue) {
        const mappedValue = field.toFormValue(value);
        if (mappedValue !== undefined) fd.set(key, mappedValue);
    } else if (value === null || value === undefined) {
        fd.set(key, "");
    } else if (isBlob(value)) {
        fd.set(key, value);
    } else {
        fd.set(key, String(value));
    }
}

/**
 * Builds the update form payload from the currently edited row values.
 */
export function buildUpdateFormData<
    R extends Record<string, unknown>,
    RI extends Record<string, unknown>,
>(form: HTMLFormElement | null, fields: FieldConfig<R, RI>[], values: Partial<RI>) {
    const fd = new FormData(form ?? undefined);

    for (const field of fields) {
        setFormDataField(fd, field, values);
    }

    return fd;
}
