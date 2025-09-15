module.exports = (text) => {
  const stack = [],
    obj = {
      "{": "}",
      "}": "{",
    };
  let s = "",
    i = 0;

  while (i < text.length && text[i] !== "{") i++;

  if (i === text.length) return null;

  while (i < text.length) {
    s += text[i];

    if (text[i] === "{") stack.push(text[i]);
    else if (obj[text[i]] === stack[stack.length - 1]) stack.pop();

    i++;

    if (stack.length === 0) break;
  }

  return s || null;
};
