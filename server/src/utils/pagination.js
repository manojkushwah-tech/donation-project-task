// ================= Pagination and Sorting Utilities =================
export const getPagination = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.max(parseInt(query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// ================= Sorting Utility =================
export const getSorting = (query) => {
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  return { [sortBy]: sortOrder };
};