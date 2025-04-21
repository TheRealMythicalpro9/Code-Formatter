
module.exports = {
  languages: [
    {
      name: "JSON",
      parsers: ["json-parser"],
      extensions: [".json"]
    }
  ],
  parsers: {
    "json-parser": {
      parse: (text) => JSON.parse(text),
      astFormat: "json-ast"
    }
  },
  printers: {
    "json-ast": {
      print: (path) => {
        return JSON.stringify(path.getValue(), null, 2);
      }
    }
  }
};
