export default function deepClone(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  } else if (typeof obj === "object" && obj !== null) {
    const clonedObj: object = {};
    for (const key in obj) {
      clonedObj[key] = deepClone(obj[key]);
    }
    return clonedObj;
  } else {
    return obj;
  }
}
