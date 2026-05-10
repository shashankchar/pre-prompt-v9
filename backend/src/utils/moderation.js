const patterns = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /(\+?\d[\d\s().-]{7,}\d)/,
  /\b(whatsapp|telegram|discord|instagram|insta|ig|gmail|email|phone|call me|dm me)\b/i,
  /(?:@[\w.]{3,})/
];

export function moderateText(text = "") {
  const flagged = patterns.some((pattern) => pattern.test(text));
  return {
    flagged,
    warning: flagged
      ? "This message may contain off-platform contact details. Keep communication on EditBridge."
      : ""
  };
}
