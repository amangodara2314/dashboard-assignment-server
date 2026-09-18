import Record from "./record.model.js";

async function insertMany(records) {
  return Record.insertMany(records, { ordered: false });
}

async function findWithFilters({
  page,
  limit,
  search,
  type,
  linkStatus,
  downloadStatus,
  dateFrom,
  dateTo,
}) {
  const query = {};

  if (search?.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
    ];
  }

  if (type && type !== "all") {
    query.type = type;
  }

  if (linkStatus && linkStatus !== "all") {
    query.linkStatus = linkStatus;
  }

  if (downloadStatus && downloadStatus !== "all") {
    query.downloadStatus = downloadStatus;
  }

  if (dateFrom || dateTo) {
    query.addedOn = {};

    if (dateFrom) {
      query.addedOn.$gte = new Date(dateFrom);
    }

    if (dateTo) {
      query.addedOn.$lte = new Date(dateTo);
    }
  }

  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Record.find(query).skip(skip).limit(limit).sort({ addedOn: -1 }),

    Record.countDocuments(query),
  ]);

  return {
    records,
    total,
  };
}
async function findById(id) {
  return Record.findById(id).lean();
}

async function updateById(id, data) {
  return Record.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
}

async function deleteById(id) {
  return Record.findByIdAndDelete(id).lean();
}

async function getSummaryCounts() {
  const results = await Record.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  const summary = { allData: 0, students: 0, teachers: 0, institutes: 0 };
  for (const r of results) {
    summary.allData += r.count;
    if (r._id === "Student") summary.students = r.count;
    if (r._id === "Teacher") summary.teachers = r.count;
    if (r._id === "Institute") summary.institutes = r.count;
  }
  return summary;
}

export default {
  insertMany,
  findWithFilters,
  findById,
  updateById,
  deleteById,
  getSummaryCounts,
};
