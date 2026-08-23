const fs = require('fs');

function fixFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  const searchStr = '  return (\n    <div\n      className={styles.cardWrapper}';
  const replaceStr = '  return (\n    <>\n      <div\n        className={styles.cardWrapper}';
  
  const searchStr2 = '  return (\n      <div\n        className={styles.cardWrapper}';
  const replaceStr2 = '  return (\n      <>\n        <div\n          className={styles.cardWrapper}';

  if (content.includes(searchStr)) {
      content = content.replace(searchStr, replaceStr);
  } else if (content.includes(searchStr2)) {
      content = content.replace(searchStr2, replaceStr2);
  } else {
      content = content.replace(
        /return\s*\(\s*<div\s+className=\{styles\.cardWrapper\}/,
        'return (\n    <>\n      <div\n        className={styles.cardWrapper}'
      );
  }

  fs.writeFileSync(filename, content);
}

fixFile('src/components/product/ProductCard.js');
