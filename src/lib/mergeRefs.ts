import { MutableRefObject } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeRefs<T = any>(
    ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
    return (value) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref != null && typeof ref === "object") {
                (ref as MutableRefObject<T | null>).current = value;
            }
        });
    };
}
