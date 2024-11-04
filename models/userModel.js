const { prisma } = require("../helpers/dbHelper");
const bcrypt = require("bcrypt");
const formatDate = require("../utils/formatdata");
// exports.getAllUsers = async () => {
//   return await prisma.user.findMany();
// };
exports.getAllUsers = async ({ limit, offset, search }) => {
  const whereClause = search
    ? {
        OR: [
          { userName: { contains: search } },
          { emailAddress: { contains: search } },
        ],
      }
    : {};

  const count = await prisma.user.count({ where: whereClause });
  const rows = await prisma.user.findMany({
    where: whereClause,
    take: limit, // limit the number of results
    skip: offset, // skip the given number of results
    select: {
      // Use select here as well
      id: true,
      userName: true,
      emailAddress: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  // Format dates after fetching from the database
  const formattedRows = rows.map((user) => ({
    ...user,
    createdAt: formatDate(user.createdAt),
    updatedAt: formatDate(user.updatedAt),
  }));

  return { count, rows: formattedRows };
};
exports.getUserByEmail = async (emailAddress) => {
  return await prisma.user.findMany({
    where: {
      emailAddress: emailAddress,
    },
  });
};

exports.getUserById = async (id) => {
  user = await prisma.user.findUnique({
    where: { id },
    select: {
      // Use select here as well
      id: true,
      userName: true,
      emailAddress: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    user = null;
  }
  // Format dates if user is found
  if (user) {
    user.createdAt = formatDate(user.createdAt);
    user.updatedAt = formatDate(user.updatedAt);
  }
  return user;
};

exports.getUserName = async (userName) => {
  return await prisma.user.findMany({
    where: {
      userName: userName,
    },
    select: {
      // Use select here as well
      id: true,
      userName: true,
      emailAddress: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

exports.getUserNameForLogin = async (userName) => {
  return await prisma.user.findMany({
    where: {
      userName: userName,
    },
  });
};

// exports.createUser = async (data) => {
//   console.log(data);
//   return await prisma.user.create({ data });
// };
exports.createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10); // Hash the password

  return await prisma.user.create({
    data: {
      // Make sure to include 'data:' here
      userName: data.userName,
      emailAddress: data.emailAddress,
      password: hashedPassword,
      // Add other fields as needed
    },
  });
};

exports.updateUser = async (id, data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10); // Hash the password
  return await prisma.user.update({
    where: { id },
    data: {
      // Make sure to include 'data:' here
      userName: data.userName,
      emailAddress: data.emailAddress,
      password: hashedPassword,
      // Add other fields as needed
    },
  });
};

exports.deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id } });
};
