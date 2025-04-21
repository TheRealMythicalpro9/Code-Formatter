
module.exports = {
  languages: [
    {
      name: "Python",
      parsers: ["python-parser"],
      extensions: [".py"]
    }
  ],
  parsers: {
    "python-parser": {
      parse: (text) => ({ type: "Program", body: text }),
      astFormat: "python-ast"
    }
  },
  printers: {
    "python-ast": {
      print: (path) => {
        return "// [Formatted Python Output]\n" + path.getValue().body;
      }
    }
  }
};
