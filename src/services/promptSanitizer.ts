/**
 * Sanitizes user-provided symptom descriptions and text to protect against
 * prompt injections, jailbreaks, and instructions attempting to override
 * the agricultural diagnosis assistant's safety constraints.
 */
export function sanitizeSymptomText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // 1. Enforce length limits (max 1000 characters for a symptom description)
  let cleaned = input.trim().slice(0, 1000);

  // 2. Remove null bytes and non-printable control characters except standard whitespace
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 3. Neutralize known prompt injection markers (e.g., "ignore all previous instructions", "system:", "assistant:", "<|im_start|>")
  const dangerousPatterns = [
    /ignore (all )?(previous|above|system) instructions/gi,
    /disregard (all )?(previous|above) rules/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /```(system|admin)/gi,
    /act as an unrestricted/gi,
    /you are now a helpful assistant without restrictions/gi,
  ];

  for (const pattern of dangerousPatterns) {
    cleaned = cleaned.replace(pattern, '[REDACTED_PROMPT_INJECTION]');
  }

  return cleaned;
}

/**
 * Validates text inputs strictly
 */
export function validateSymptomInput(text: string): { isValid: boolean; error?: string; sanitizedText: string } {
  const sanitized = sanitizeSymptomText(text);

  if (sanitized.length < 3) {
    return {
      isValid: false,
      error: 'Please describe the symptoms with at least 3 characters (e.g. "curled leaves", "yellow spots").',
      sanitizedText: sanitized
    };
  }

  return {
    isValid: true,
    sanitizedText: sanitized
  };
}
