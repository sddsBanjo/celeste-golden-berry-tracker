export function isNonEmptyString(value) {
    return typeof value === "string" && value.trim() !== "";
}