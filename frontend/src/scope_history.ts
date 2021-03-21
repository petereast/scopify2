interface HistoryItem {
  id: string;
  timestamp: Date;
}

const SCOPE_HISTORY = "scope_history";

export function getHistory(): HistoryItem[] {
  return JSON.parse(localStorage.getItem(SCOPE_HISTORY) || "[]").map(
    (item: { id: string; timestamp: string }) => ({
      id: item.id,
      timestamp: new Date(item.timestamp),
    })
  );
}

function setHistory(history: HistoryItem[]) {
  localStorage.setItem(SCOPE_HISTORY, JSON.stringify(history));
}

export function addHistoryItem(id: string): HistoryItem[] {
  const history = getHistory();

  const newHistory = [...history, { id, timestamp: new Date() }];
  setHistory(newHistory);

  return newHistory;
}

export function removeId(id: string): void {
  const history = getHistory();
  const newHistory = history.filter((item) => item.id !== id);
  setHistory(newHistory);
}
