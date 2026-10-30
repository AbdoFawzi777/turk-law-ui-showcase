export type SelectOption = { value: string | number | boolean; label: string };

export function selectDisplayValue(value: unknown): string {
    return value === null || value === undefined ? '' : String(value);
}

export function resolveSelectValue(value: string, options: readonly SelectOption[] = []): string | number | boolean {
    return options.find((option) => String(option.value) === value)?.value ?? value;
}

export function selectDisplayLabel(value: unknown, options: readonly SelectOption[] = []): string {
    const display = selectDisplayValue(value);
    return options.find((option) => String(option.value) === display)?.label ?? (display || '-');
}
