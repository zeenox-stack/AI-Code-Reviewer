const updatePath = ({ pathsMap, path, a, b }) => {
  const value = pathsMap.get(path) ?? { [a]: false, [b]: false };

  const updated = { ...value, [a]: true };
  pathsMap.set(path, { ...updated, name: path });
};

module.exports = ({ added, removed }) => {
  const pathsMap = new Map();

  for (const path of added) {
    updatePath({ pathsMap, path, a: "added", b: "removed" });
  }
  for (const path of removed) {
    updatePath({ pathsMap, path, a: "removed", b: "added" });
  }

  return pathsMap;
};
