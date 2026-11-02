import { useCallback, useEffect, useRef, useState } from 'react';

// ===========================|| HOOKS - COPY TO CLIPBOARD ||=========================== //

export default function useCopyToClipboard(resetAfterMs = 2500) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.clearTimeout(timeout.current);
        timeout.current = window.setTimeout(() => setCopied(false), resetAfterMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetAfterMs]
  );

  return { copied, copy };
}
