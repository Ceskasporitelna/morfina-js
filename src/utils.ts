const isObjectEmpty = (obj: object) => Object.keys(obj).length === 0 && obj.constructor === Object;

export { isObjectEmpty }