import { useAppStore } from '../store/useAppStore';

export function useMockMode() {
  const mockMode = useAppStore((s) => s.mockMode);
  const toggleMockMode = useAppStore((s) => s.toggleMockMode);

  return { mockMode, toggleMockMode };
}
