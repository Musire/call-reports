

export function getRowColors(values: number[]) {
  const minGray = 0x9a; // 154
  const maxGray = 0xf5; // 245

  // treat 0 as "no data"
  const filtered = values.filter(v => v > 0);

  const min = Math.min(...filtered);
  const max = Math.max(...filtered);

  return values.map((v) => {
    // empty cell
    if (v === 0) return "#000000";

    const ratio = max === min ? 1 : (v - min) / (max - min);

    const gray = Math.round(minGray + ratio * (maxGray - minGray));
    const hex = gray.toString(16).padStart(2, "0");

    return `#${hex}${hex}${hex}`;
  });
}