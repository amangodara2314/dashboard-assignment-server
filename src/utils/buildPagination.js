export default function buildPagination(page, limit, totalCount) {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    page,
    limit,
    totalCount,
    totalPages,
  };
}
