export function getUserSubscription(userId: string): "Annual" | "Monthly" {
  return Number(userId) % 2 ? "Annual" : "Monthly";
}

export function getPaginationRange(
  page: number,
  pageCount: number,
): (number | "ellipsis")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const items: (number | "ellipsis")[] = [1];
  if (page > 3) items.push("ellipsis");
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  for (let i = start; i <= end; i += 1) items.push(i);
  if (page < pageCount - 2) items.push("ellipsis");
  if (pageCount > 1) items.push(pageCount);
  return items;
}
